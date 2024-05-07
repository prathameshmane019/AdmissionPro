"use client"
import React, { useState } from "react";
import axios from "axios";

const StudentFilters = () => {
    const [filters, setFilters] = useState({
        firstName: "",
        lastName: "",
        category: "",
        Gender: "",
        pcm: "",
        cet: "",
        jee: "",
        hsc: "",
    });

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get("/api/students", {
                params: filters,
            });
            // Handle the response data
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    return (
        <div>
            <h2>Student Filters</h2>
            <div>
                <label>
                    First Name:
                    <input
                        type="text"
                        name="firstName"
                        value={filters.firstName}
                        onChange={handleFilterChange}
                    />
                </label>
            </div>
            <div>
                <label>
                    Last Name:
                    <input
                        type="text"
                        name="lastName"
                        value={filters.lastName}
                        onChange={handleFilterChange}
                    />
                </label>
            </div>
            <div>
                <label>
                    Category:
                    <input
                        type="text"
                        name="category"
                        value={filters.category}
                        onChange={handleFilterChange}
                    />
                </label>
            </div>
            <div>
                <label>
                    Gender:
                    <input
                        type="text"
                        name="Gender"
                        value={filters.Gender}
                        onChange={handleFilterChange}
                    />
                </label>
            </div>
            <div>
                <label>
                    PCM Range (e.g., 100,200):
                    <input
                        type="text"
                        name="pcm"
                        value={filters.pcm}
                        onChange={handleFilterChange}
                    />
                </label>
            </div>
            <div>
                <label>
                    CET Range (e.g., 50,80):
                    <input
                        type="text"
                        name="cet"
                        value={filters.cet}
                        onChange={handleFilterChange}
                    />
                </label>
            </div>
            <div>
                <label>
                    JEE Range (e.g., 20,60):
                    <input
                        type="text"
                        name="jee"
                        value={filters.jee}
                        onChange={handleFilterChange}
                    />
                </label>
            </div>
            <div>
                <label>
                    HSC Range (e.g., 60,90):
                    <input
                        type="text"
                        name="hsc"
                        value={filters.hsc}
                        onChange={handleFilterChange}
                    />
                </label>
            </div>
            <button onClick={handleSearch}>Search</button>
        </div>
    );
};

export default StudentFilters;