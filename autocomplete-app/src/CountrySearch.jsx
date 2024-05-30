import React, { useState, useEffect, useRef } from "react";
import countryData from "./Data.json";
import "./CountrySearch.css";

const CountrySearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isShowingSuggestions, setIsShowingSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchTerm) {
      const filteredCountries = countryData
        .filter((country) =>
          country.name.toLowerCase().startsWith(searchTerm.toLowerCase())
        )
        .map((country) => country.name);
      setFilteredSuggestions(filteredCountries);
      setIsShowingSuggestions(true);
    } else {
      setFilteredSuggestions([]);
      setIsShowingSuggestions(false);
    }
  }, [searchTerm]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (selectedSuggestionIndex < filteredSuggestions.length - 1) {
        setSelectedSuggestionIndex((prevIndex) => prevIndex + 1);
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (selectedSuggestionIndex > 0) {
        setSelectedSuggestionIndex((prevIndex) => prevIndex - 1);
      }
    } else if (event.key === "Enter") {
      if (selectedSuggestionIndex !== -1) {
        setSearchTerm(filteredSuggestions[selectedSuggestionIndex]);
      }
      handleSearch();
    } else if (event.key === "Escape") {
      setIsShowingSuggestions(false);
    }
  };

  const handleSearch = () => {
    const filteredCountries = countryData.filter((country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Display the filtered countries
  };

  const handleSuggestionClick = (country) => {
    setSearchTerm(country);
    setIsShowingSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isShowingSuggestions &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setIsShowingSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isShowingSuggestions]);

  useEffect(() => {
    const handleKeyNavigation = (event) => {
      if (!isShowingSuggestions) return;

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
      }

      if (event.key === "ArrowDown" && selectedSuggestionIndex < filteredSuggestions.length - 1) {
        setSelectedSuggestionIndex((prevIndex) => prevIndex + 1);
      } else if (event.key === "ArrowUp" && selectedSuggestionIndex > 0) {
        setSelectedSuggestionIndex((prevIndex) => prevIndex - 1);
      }
    };

    document.addEventListener("keydown", handleKeyNavigation);
    return () => {
      document.removeEventListener("keydown", handleKeyNavigation);
    };
  }, [isShowingSuggestions, selectedSuggestionIndex, filteredSuggestions.length]);

  return (
    <div className="card-container">
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Search for a country..."
        className="search-input"
        ref={searchInputRef}
      />
      <button onClick={handleSearch} className="search-button">
        Search
      </button>
      {isShowingSuggestions && (
        <ul className="suggestions-list">
          {filteredSuggestions.map((country, index) => (
            <li
              key={country}
              onClick={() => handleSuggestionClick(country)}
              className={index === selectedSuggestionIndex ? "suggestion-item selected" : "suggestion-item"}
            >
              {country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CountrySearch;