import React, { useState, useEffect } from "react";
import {
  getLatestNews,
  getAllLatestNews,
  getTrendingNews,
  searchNews,
} from "./api/newsApi";
import { formatArticles } from "./utils/articleFormatter";
//import { testAPI } from './utils/apiTest';
import {
  Navigation,
  MobileSidebar,
  TrendingSection,
  NewsGrid,
  Footer,
} from "./components";

/**
 * Main App Component
 * Orchestrates the news application with state management and data fetching
 */
export default function App() {
  // State Management
  const [activeTab, setActiveTab] = useState("top");
  const [articles, setArticles] = useState([]);
  const [trending, setTrending] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Test API on mount
  // useEffect(() => {
  //   testAPI();
  // }, []);

  // Load initial data when active tab changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // console.log("🔍 Fetching data for category:", activeTab);

        // Fetch all latest news
        const [latestData, trendingData] = await Promise.all([
          getAllLatestNews(50),
          getTrendingNews(6),
        ]);

        // console.log("📡 Raw API Response - Latest:", latestData);
        // console.log("📡 Raw API Response - Trending:", trendingData);

        // Filter by category on frontend (except for 'top' and 'breaking' which show all)
        let filteredData = latestData;
        if (activeTab !== "top" && activeTab !== "breaking") {
          filteredData = latestData.filter(
            (article) =>
              article.category && article.category.includes(activeTab),
          );
        }

        // console.log(
        //   "🔎 Filtered articles for",
        //   activeTab,
        //   ":",
        //   filteredData.length,
        // );

        // Format articles using the article formatter
        const formattedArticles = formatArticles(filteredData);
        const formattedTrending = formatArticles(trendingData);

        // console.log("✅ Formatted Articles:", formattedArticles);
        // console.log("✅ Formatted Trending:", formattedTrending);

        setArticles(formattedArticles);
        setTrending(formattedTrending);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
        setArticles([]);
        setTrending([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  /**
   * Handles search form submission
   */
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const results = await searchNews(searchQuery, 20);
      const formattedResults = formatArticles(results);
      setArticles(formattedResults);
    } catch (error) {
      console.error("Error searching:", error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clears filters and reloads initial data
   */
  const handleClearFilters = async () => {
    setSearchQuery("");
    setLoading(true);
    try {
      const [latestData, trendingData] = await Promise.all([
        getLatestNews("in", activeTab, 20),
        getTrendingNews(6),
      ]);

      const formattedArticles = formatArticles(latestData);
      const formattedTrending = formatArticles(trendingData);

      setArticles(formattedArticles);
      setTrending(formattedTrending);
    } catch (error) {
      console.error("Error clearing filters:", error);
      setArticles([]);
      setTrending([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles logo click to reset state
   */
  const handleLogoClick = async () => {
    setSearchQuery("");
    setActiveTab("top");
    setLoading(true);
    try {
      const [latestData, trendingData] = await Promise.all([
        getLatestNews("in", "top", 20),
        getTrendingNews(6),
      ]);

      const formattedArticles = formatArticles(latestData);
      const formattedTrending = formatArticles(trendingData);

      setArticles(formattedArticles);
      setTrending(formattedTrending);
    } catch (error) {
      console.error("Error resetting:", error);
      setArticles([]);
      setTrending([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed top-0 right-0 w-150 h-150 bg-linear-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-float"></div>
      <div
        className="fixed bottom-0 left-0 w-150 h-150 bg-linear-to-br from-indigo-500/10 to-pink-500/10 rounded-full blur-3xl"
        style={{ animationDelay: "1s" }}
      ></div>

      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        onLogoClick={handleLogoClick}
      />

      <MobileSidebar
        isMenuOpen={isMenuOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setIsMenuOpen={setIsMenuOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />

      <main className="max-w-7xl mx-auto px-4 pt-28 pb-20 relative z-10">
        {!searchQuery && <TrendingSection trending={trending} />}

        <NewsGrid
          articles={articles}
          loading={loading}
          searchQuery={searchQuery}
          activeTab={activeTab}
          onClearFilters={handleClearFilters}
        />
      </main>

      <Footer />
    </div>
  );
}
