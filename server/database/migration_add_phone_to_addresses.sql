-- Migration: Add phone column to user_addresses table
-- Run this script to add phone number support to existing addresses

USE wearship_db;

-- Add phone column to user_addresses table
ALTER TABLE user_addresses 
ADD COLUMN phone VARCHAR(20) AFTER company;

-- Verify the column was added
DESCRIBE user_addresses;

-- Show sample data (if any exists)
SELECT id, first_name, last_name, phone, city, state FROM user_addresses LIMIT 5; 