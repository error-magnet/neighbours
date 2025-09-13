#!/usr/bin/env node
const fs = require('fs');

function convertCsvToJson(csvFile, outputFile) {
    const csvContent = fs.readFileSync(csvFile, 'utf-8');
    const lines = csvContent.trim().split('\n');

    // Skip header row
    const dataLines = lines.slice(1);

    const countries = {};

    dataLines.forEach(line => {
        // Parse CSV line (handle quoted values)
        const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        if (!matches || matches.length < 4) return;

        const countryCode = matches[0].replace(/"/g, '');
        const countryName = matches[1].replace(/"/g, '');
        const borderCode = matches[2].replace(/"/g, '');
        const borderName = matches[3].replace(/"/g, '');

        // Initialize country if not exists
        if (!countries[countryCode]) {
            countries[countryCode] = {
                code: countryCode,
                name: countryName,
                borders: []
            };
        }

        // Add border only if border code and name are not empty
        if (borderCode && borderName && borderCode.trim() !== '' && borderName.trim() !== '') {
            countries[countryCode].borders.push({
                code: borderCode,
                name: borderName
            });
        }
    });

    // Handle countries that might exist in the data but have no valid borders
    // This ensures all countries are included even if they have empty border arrays

    // Convert to array and sort by country code
    const result = Object.values(countries).sort((a, b) => a.code.localeCompare(b.code));

    // Write JSON file
    fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));

    console.log(`Converted ${result.length} countries to JSON format`);
    console.log(`Output saved to: ${outputFile}`);
}

// Run the conversion
convertCsvToJson('country_borders.csv', 'countries_with_borders.json');