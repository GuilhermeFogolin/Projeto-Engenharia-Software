import requests
import os
from typing import Optional, Dict
from dotenv import load_dotenv

load_dotenv()

class ApiApod:
    def __init__(self):
        self.base_url = "https://api.nasa.gov/planetary/apod"
        self.api_key = os.getenv("NASA_API_KEY", "DEMO_KEY")

    def _build_common_payload(self, payload: dict) -> Optional[Dict[str, str]]:
        if not payload or payload.get("media_type") != "image":
            return None

        return {
            "title": payload.get("title"),
            "description": payload.get("explanation"),
            "href": payload.get("hdurl") or payload.get("url"),
            "date": payload.get("date"),
            "credits": payload.get("copyright"),
        }

    def get_random_images(self, count: int = 6):
        try:
            response = requests.get(
                self.base_url,
                params={"count": count, "api_key": self.api_key},
                timeout=10,
            )
            response.raise_for_status()
            data = response.json()

            results = []
            for item in data:
                normalized = self._build_common_payload(item)
                if normalized:
                    results.append(normalized)

            return results

        except requests.exceptions.RequestException as e:
            print(f"Error fetching data from NASA APOD API: {e}")
            return None

    def get_image_by_date(self, date: str) -> Optional[Dict[str, str]]:
        try:
            response = requests.get(
                self.base_url,
                params={"date": date, "api_key": self.api_key},
                timeout=10,
            )
            response.raise_for_status()
            data = response.json()
            return self._build_common_payload(data)
        except requests.exceptions.HTTPError as e:
            if e.response is not None and e.response.status_code == 404:
                return None
            print(f"HTTP error while fetching APOD for date {date}: {e}")
            return None
        except requests.exceptions.RequestException as e:
            print(f"Network error while fetching APOD for date {date}: {e}")
            return None