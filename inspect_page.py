import requests
from bs4 import BeautifulSoup

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

def inspect(url):
    print(f"Fetching {url}...")
    try:
        response = requests.get(url, headers=HEADERS, timeout=15)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "html.parser")
        
        # Try to find the list
        print("\n--- Searching for list items ---")
        # In the word/phrase lists, they are usually in .top-g li or similar
        list_container = soup.select_one(".top-g")
        if list_container:
            print("Found .top-g container")
            items = list_container.select("li")
            print(f"Found {len(items)} items in .top-g")
            if items:
                print("First item HTML:")
                print(items[0].prettify())
        else:
            print("Could not find .top-g. Dumping first 1000 chars of body:")
            print(soup.body.prettify()[:1000])

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    inspect("https://www.oxfordlearnersdictionaries.com/wordlists/oxford-phrase-list")
