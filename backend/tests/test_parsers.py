"""
Тесты для парсеров AniStand
"""
import asyncio
import pytest
from app.parsers.anilist import AniListParser


class TestAniListParser:
    """Тесты для AniList парсера"""
    
    @pytest.mark.asyncio
    async def test_search_anime(self):
        """Тест поиска аниме"""
        async with AniListParser() as parser:
            results = await parser.search_anime("Attack on Titan", limit=5)
            
            assert len(results) > 0
            assert any("Attack" in (anime.title_english or "") for anime in results)
    
    @pytest.mark.asyncio
    async def test_get_anime_metadata(self):
        """Тест получения метаданных аниме"""
        async with AniListParser() as parser:
            # Attack on Titan ID на AniList
            anime = await parser.get_anime_metadata("16498")
            
            assert anime is not None
            assert anime.id == 16498
            assert "Attack" in (anime.title_english or "")
            assert anime.genres is not None
            assert len(anime.genres) > 0
    
    @pytest.mark.asyncio
    async def test_get_episodes(self):
        """Тест получения списка эпизодов"""
        async with AniListParser() as parser:
            episodes = await parser.get_episodes("16498")
            
            assert len(episodes) > 0
            assert episodes[0].number == 1
            assert episodes[0].title is not None


def test_manual_anilist():
    """Ручной тест AniList API"""
    async def run_test():
        async with AniListParser() as parser:
            print("\n🔍 Testing AniList search...")
            results = await parser.search_anime("Demon Slayer")
            
            if results:
                print(f"✅ Found {len(results)} results")
                for anime in results[:3]:
                    print(f"   - {anime.title_english or anime.title_romaji}")
            
            print("\n📖 Testing anime details...")
            anime = await parser.get_anime_metadata("101922")  # Demon Slayer ID
            
            if anime:
                print(f"✅ Title: {anime.title_english}")
                print(f"   Episodes: {anime.episodes}")
                print(f"   Rating: {anime.rating}")
                print(f"   Genres: {', '.join(anime.genres or [])}")
    
    asyncio.run(run_test())


if __name__ == "__main__":
    test_manual_anilist()
