from app.ml.disease_classifier import DiseaseClassifier
from pathlib import Path
import aiofiles
from fastapi import UploadFile
import loguru
from app.services.ollama_service import generate_text_async
from app.config import settings

logger = loguru.logger
_classifier = None

TREATMENTS = {
    "apple_apple_scab": {"treatment": "Apply fungicides like captan or sulfur.", "prevention": "Prune trees to improve air circulation and remove fallen leaves.", "recommended_products": ["Captan 50 WP", "Wettable Sulfur"], "spray_advice": "Spray in the early morning with full canopy coverage and repeat after rain if symptoms persist."},
    "apple_black_rot": {"treatment": "Prune out infected branches; use fungicides if severe.", "prevention": "Maintain tree health and remove mummified fruit.", "recommended_products": ["Mancozeb", "Copper oxychloride"], "spray_advice": "Target infected branches first and maintain a 7-10 day spray interval during wet weather."},
    "corn_common_rust": {"treatment": "Apply fungicides containing azoxystrobin or pyraclostrobin.", "prevention": "Plant resistant hybrids and manage nitrogen levels.", "recommended_products": ["Azoxystrobin 23 SC", "Pyraclostrobin"], "spray_advice": "Spray when rust pustules are spreading on younger leaves and avoid high-wind hours."},
    "potato_early_blight": {"treatment": "Use fungicides such as chlorothalonil or mancozeb.", "prevention": "Crop rotation and avoid overhead watering.", "recommended_products": ["Chlorothalonil", "Mancozeb 75 WP"], "spray_advice": "Spray at first visible lesions and repeat every 7 days under humid conditions."},
    "tomato_late_blight": {"treatment": "Apply fungicides like chlorothalonil immediately; remove infected plants.", "prevention": "Avoid planting near potatoes; use resistant varieties.", "recommended_products": ["Chlorothalonil", "Metalaxyl + Mancozeb"], "spray_advice": "Spray immediately after disease confirmation and remove heavily infected foliage before the next round."},
    "tomato_yellow_leaf_curl_virus": {"treatment": "No cure for viral diseases; remove and destroy infected plants.", "prevention": "Control whiteflies with insecticidal soaps or oils.", "recommended_products": ["Neem oil spray", "Imidacloprid for whitefly control"], "spray_advice": "Spray only for vector control around surrounding healthy plants; infected plants should be removed."},
    "healthy": {"treatment": "No treatment needed", "prevention": "Continue regular monitoring and good agricultural practices.", "recommended_products": ["No pesticide required"], "spray_advice": "Do not spray unless symptoms appear; continue scouting and nutrient monitoring."},
}

def get_classifier() -> DiseaseClassifier:
    global _classifier
    if _classifier is None:
        _classifier = DiseaseClassifier()
        try:
            _classifier.load()
        except:
            logger.warning("Disease model not found, run training first")
    return _classifier

def _fallback_disease_explanation(result: dict, treatment_info: dict) -> str:
    confidence_pct = round(result.get("confidence", 0) * 100)
    disease_name = result.get("disease", "The detected disease")
    severity = str(result.get("severity", "medium")).lower()
    severity_text = "needs immediate attention" if severity == "high" else "should be monitored closely" if severity == "medium" else "looks manageable right now"
    products = ", ".join(treatment_info.get("recommended_products", [])[:2]) or "locally recommended plant protection products"
    return (
        f"{disease_name} was detected with confidence {confidence_pct}%. "
        f"It {severity_text}. Start with {treatment_info.get('treatment')} "
        f"Recommended products include {products}. "
        f"Prevention focus: {treatment_info.get('prevention')} "
        f"Spray guidance: {treatment_info.get('spray_advice')} "
        f"Over the next 3 to 5 days, monitor whether new leaves show fresh lesions, curling, yellowing, or rapid spread."
    )

async def _build_disease_explanation(result: dict, treatment_info: dict) -> str:
    fallback = _fallback_disease_explanation(result, treatment_info)
    if not settings.ENABLE_DISEASE_AI_EXPLANATION:
        return fallback

    try:
        return await generate_text_async(
            prompt=(
                "Explain a crop disease diagnosis for a farmer.\n"
                f"Diagnosis result: {result}\n"
                f"Treatment info: {treatment_info}\n\n"
                "Explain what the disease means, why the spray is recommended, what precautions to take, and what to monitor over the next few days."
            ),
            system="You are a plant pathologist helping a farmer with practical disease management.",
            timeout=settings.DISEASE_AI_TIMEOUT_SECONDS,
        )
    except Exception as exc:
        logger.warning(f"Falling back to deterministic disease explanation: {exc}")
        return fallback

async def save_upload(file: UploadFile, upload_dir="data/uploads") -> str:
    Path(upload_dir).mkdir(parents=True, exist_ok=True)
    path = f"{upload_dir}/{file.filename}"
    async with aiofiles.open(path, "wb") as f:
        content = await file.read()
        await f.write(content)
    return path

async def diagnose_disease(image_path: str):
    clf = get_classifier()
    if not clf.interpreter:
        return {"error": "Disease model not loaded"}
    
    result = clf.predict(image_path)
    if "error" in result:
        return result

    # Standardize name for treatment lookup: e.g. "Apple: Apple scab" -> "apple_apple_scab"
    # or just use raw_label which is "Apple___Apple_scab" -> "apple_apple_scab"
    raw_label = result.get("raw_label", "unknown")
    disease_key = raw_label.lower().replace("___", "_").replace("_", "_") # already underscores usually
    
    # Simple mapping logic for demonstration, would ideally be expanded
    treatment_info = TREATMENTS.get(disease_key, {
        "treatment": "Consult an agricultural specialist for a detailed treatment plan.",
        "prevention": "Ensure proper field sanitation, crop rotation, and use of certified disease-free seeds.",
        "recommended_products": ["Consult local agri-input expert before spraying"],
        "spray_advice": "Confirm the disease with a local expert and follow label dosage strictly before spraying.",
    })

    severity = result.get("severity", "Moderate")
    risk_level = result.get("riskLevel")
    if not risk_level:
        risk_level = "High" if str(severity).lower() in {"high", "critical"} else "Medium" if str(severity).lower() == "moderate" else "Low"

    ai_explanation = await _build_disease_explanation(result, treatment_info)

    return {
        **result,
        "riskLevel": risk_level,
        "treatment": treatment_info.get("treatment"),
        "prevention": treatment_info.get("prevention"),
        "recommended_products": treatment_info.get("recommended_products"),
        "spray_advice": treatment_info.get("spray_advice"),
        "ai_explanation": ai_explanation,
    }
