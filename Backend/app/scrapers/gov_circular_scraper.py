import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import pdfplumber
from pathlib import Path
import loguru
from typing import List, Dict
import time

logger = loguru.logger

GOV_SOURCES = [

    {
        "name": "AgriCoop — Ministry of Agriculture & Farmers Welfare",
        "url": "https://agricoop.nic.in/en/schemes-and-grants",
        "type": "html",
        "keywords": ["scheme", "circular", "notification", "grant", "subsidy"],
    },
    {
        "name": "AgriCoop — Notifications & Circulars",
        "url": "https://agricoop.nic.in/en/notifications",
        "type": "html",
        "keywords": ["notification", "circular", "order"],
    },
    {
        "name": "PM-KISAN Official Portal",
        "url": "https://pmkisan.gov.in/",
        "type": "html",
        "keywords": ["scheme", "beneficiary", "payment", "circular"],
    },
    {
        "name": "PMFBY — Crop Insurance Scheme",
        "url": "https://pmfby.gov.in/",
        "type": "html",
        "keywords": ["insurance", "scheme", "circular", "notification", "guideline"],
    },
    {
        "name": "eNAM — National Agriculture Market",
        "url": "https://www.enam.gov.in/web/",
        "type": "html",
        "keywords": ["scheme", "circular", "notification"],
    },
    {
        "name": "Paramparagat Krishi Vikas Yojana (PKVY)",
        "url": "https://pgsindia-ncof.gov.in/pkvy/index.aspx",
        "type": "html",
        "keywords": ["scheme", "circular", "organic", "guideline"],
    },
    {
        "name": "National Food Security Mission",
        "url": "https://nfsm.gov.in/",
        "type": "html",
        "keywords": ["scheme", "circular", "notification", "guideline"],
    },
    {
        "name": "Rashtriya Krishi Vikas Yojana (RKVY)",
        "url": "https://rkvy.nic.in/",
        "type": "html",
        "keywords": ["scheme", "circular", "guideline", "notification"],
    },
    {
        "name": "Sub-Mission on Agriculture Mechanisation (SMAM)",
        "url": "https://agrimachinery.nic.in/",
        "type": "html",
        "keywords": ["scheme", "subsidy", "circular", "notification"],
    },
    {
        "name": "Soil Health Card Scheme",
        "url": "https://soilhealth.dac.gov.in/",
        "type": "html",
        "keywords": ["scheme", "circular", "soil", "guideline"],
    },
    {
        "name": "Micro Irrigation Fund — NABARD",
        "url": "https://www.nabard.org/content.aspx?id=591",
        "type": "html",
        "keywords": ["scheme", "circular", "irrigation", "subsidy"],
    },
    {
        "name": "Pradhan Mantri Krishi Sinchai Yojana (PMKSY)",
        "url": "https://pmksy.gov.in/",
        "type": "html",
        "keywords": ["scheme", "circular", "irrigation", "guideline"],
    },
    {
        "name": "Kisan Credit Card (KCC) — RBI Circular Hub",
        "url": "https://www.rbi.org.in/Scripts/BS_ViewMasCirculardetails.aspx?id=12059",
        "type": "html",
        "keywords": ["circular", "kcc", "credit", "kisan"],
    },
    {
        "name": "Agricultural & Processed Food Products Export Dev. Authority (APEDA)",
        "url": "https://apeda.gov.in/apedawebsite/six_head_product/scheme.htm",
        "type": "html",
        "keywords": ["scheme", "export", "subsidy", "circular"],
    },
    {
        "name": "National Horticulture Mission",
        "url": "https://nhm.nic.in/index1.php?lang=1&level=0&linkid=1&lid=1",
        "type": "html",
        "keywords": ["scheme", "horticulture", "circular", "guideline"],
    },
    {
        "name": "National Horticulture Board (NHB)",
        "url": "https://nhb.gov.in/scheme-details.aspx",
        "type": "html",
        "keywords": ["scheme", "subsidy", "circular", "horticulture"],
    },
    {
        "name": "Fisheries Schemes — PMMSY",
        "url": "https://pmmsy.dof.gov.in/",
        "type": "html",
        "keywords": ["scheme", "fisheries", "circular", "notification"],
    },
    {
        "name": "Animal Husbandry Infrastructure Development Fund",
        "url": "https://ahidf.udyamimitra.in/",
        "type": "html",
        "keywords": ["scheme", "animal", "husbandry", "circular"],
    },

    {
        "name": "MyGov Farmer Schemes",
        "url": "https://www.mygov.in/schemes/?domain_name=farmer",
        "type": "html",
        "keywords": ["scheme", "farmer", "circular", "notification"],
    },
    {
        "name": "NABARD — Schemes & Circulars",
        "url": "https://www.nabard.org/content.aspx?id=7",
        "type": "html",
        "keywords": ["scheme", "circular", "refinance", "notification"],
    },
    {
        "name": "Ministry of Rural Development — Schemes",
        "url": "https://rural.nic.in/en/schemes-and-programmes",
        "type": "html",
        "keywords": ["scheme", "circular", "rural", "notification"],
    },
    {
        "name": "MGNREGS Official Portal",
        "url": "https://nrega.nic.in/netnrega/home.aspx",
        "type": "html",
        "keywords": ["scheme", "circular", "employment", "notification"],
    },
    {
        "name": "PM Fasal Bima Yojana — Guidelines",
        "url": "https://pmfby.gov.in/adminStaticPage/guidelines",
        "type": "html",
        "keywords": ["guideline", "circular", "insurance", "scheme"],
    },

    {
        "name": "Maharashtra Agriculture Dept",
        "url": "https://krishi.maharashtra.gov.in/",
        "type": "html",
        "keywords": ["scheme", "circular", "yojana", "notification", "subsidy"],
    },
    {
        "name": "Mahadbt — Maharashtra Farmer Schemes",
        "url": "https://mahadbt.maharashtra.gov.in/Farmer/SchemeData/SchemeData",
        "type": "html",
        "keywords": ["scheme", "subsidy", "yojana"],
    },

    {
        "name": "UP Agriculture Dept",
        "url": "https://upagriculture.com/",
        "type": "html",
        "keywords": ["scheme", "circular", "yojana", "subsidy"],
    },

    {
        "name": "Punjab Agriculture Dept",
        "url": "http://agripb.gov.in/",
        "type": "html",
        "keywords": ["scheme", "circular", "yojana", "subsidy"],
    },

    {
        "name": "Rajasthan Agriculture Dept",
        "url": "https://agriculture.rajasthan.gov.in/content/agriculture/en/dept-schemes.html",
        "type": "html",
        "keywords": ["scheme", "circular", "yojana", "subsidy"],
    },

    {
        "name": "Karnataka Agriculture Dept",
        "url": "https://raitamitra.karnataka.gov.in/English/Pages/Schemes.aspx",
        "type": "html",
        "keywords": ["scheme", "circular", "subsidy", "yojana"],
    },

    {
        "name": "Coffee Board of India — Schemes",
        "url": "https://www.indiacoffee.org/schemes.html",
        "type": "html",
        "keywords": ["scheme", "subsidy", "circular"],
    },
    {
        "name": "Spices Board — Schemes",
        "url": "https://www.spicesboard.gov.in/spices-board-schemes.php",
        "type": "html",
        "keywords": ["scheme", "subsidy", "circular"],
    },
    {
        "name": "Coconut Development Board — Schemes",
        "url": "https://www.coconutboard.gov.in/schemes.htm",
        "type": "html",
        "keywords": ["scheme", "subsidy", "circular", "development"],
    },
    {
        "name": "Cotton Corporation of India",
        "url": "https://cotcorp.org.in/scheme.aspx",
        "type": "html",
        "keywords": ["scheme", "circular", "cotton", "procurement"],
    },

    # ── Direct PDF Sources ────────────────────────────────────────────────────
    {
        "name": "PM-KISAN Operational Guidelines PDF",
        "url": "https://pmkisan.gov.in/Documents/RevisedPM-KISANOperationalGuidelines(English).pdf",
        "type": "pdf",
    },
    {
        "name": "PMFBY Operational Guidelines PDF",
        "url": "https://pmfby.gov.in/pdf/PMFBY_Operational_Guidelines_2016.pdf",
        "type": "pdf",
    },
]


class GovCircularScraper:
    def __init__(self, user_agent="KrishiSutra/1.0"):
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": user_agent})

    def scrape_html(self, source: Dict) -> List[Dict]:
        keywords = source.get("keywords", ["scheme", "circular", "notification"])
        selector = ", ".join(f"a[href*='{kw}']" for kw in keywords)
        try:
            resp = self.session.get(source["url"], timeout=10)
            soup = BeautifulSoup(resp.text, "html.parser")
            items = []
            seen_urls = set()
            for link in soup.select(selector)[:15]:
                href = link.get("href")
                if href:
                    full_url = urljoin(source["url"], href)
                    if full_url not in seen_urls:
                        seen_urls.add(full_url)
                        items.append({
                            "title": link.text.strip() or full_url,
                            "url": full_url,
                            "source": source["name"],
                            "type": "html",
                            "is_pdf": full_url.lower().endswith(".pdf"),
                        })
            return items
        except Exception as e:
            logger.error(f"Scrape error {source['url']}: {e}")
            return []

    def extract_pdf_text(self, pdf_url: str, save_dir: str = "data/pdfs") -> str:
        Path(save_dir).mkdir(parents=True, exist_ok=True)
        try:
            resp = self.session.get(pdf_url, timeout=15)
            filename = pdf_url.split("/")[-1] or "document.pdf"
            pdf_path = Path(save_dir) / filename
            pdf_path.write_bytes(resp.content)
            text = ""
            with pdfplumber.open(pdf_path) as pdf:
                for page in pdf.pages:
                    text += page.extract_text() or ""
            return text
        except Exception as e:
            logger.error(f"PDF extract error {pdf_url}: {e}")
            return ""

    def run_all(self, extract_pdfs: bool = False) -> List[Dict]:
        all_items = []
        for src in GOV_SOURCES:
            logger.info(f"Scraping [{src['type'].upper()}] {src['name']} ...")
            if src["type"] == "pdf":
                # Directly extract PDF text for known PDF sources
                text = self.extract_pdf_text(src["url"])
                if text:
                    all_items.append({
                        "title": src["name"],
                        "url": src["url"],
                        "source": src["name"],
                        "type": "pdf",
                        "text_preview": text[:500],
                    })
            else:
                items = self.scrape_html(src)
                # Optionally follow and extract PDF links found during HTML scraping
                if extract_pdfs:
                    for item in items:
                        if item.get("is_pdf"):
                            item["text_preview"] = self.extract_pdf_text(item["url"])[:500]
                all_items.extend(items)
            time.sleep(1)  # Be polite to government servers
        return all_items


if __name__ == "__main__":
    scraper = GovCircularScraper()
    # Set extract_pdfs=True to also download & extract text from PDF links found during scraping
    results = scraper.run_all(extract_pdfs=False)
    print(f"\n✅ Scraped {len(results)} items from {len(GOV_SOURCES)} sources\n")
    for r in results[:10]:
        print(f"  [{r['source']}] {r['title'][:80]}")
        print(f"    → {r['url']}\n")