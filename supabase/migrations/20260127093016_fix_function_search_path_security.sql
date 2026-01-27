/*
  # Fix Function Search Path Security Warnings
  
  1. Security Improvements
    - Set explicit search_path for `create_user_profile` function
    - Set explicit search_path for `update_user_stats` function
    - Prevents potential search_path hijacking attacks
  
  2. Notes
    - These changes fix the "role mutable search_path" warnings
    - Functions now have a fixed, secure search_path
*/

-- Fix create_user_profile function
ALTER FUNCTION public.create_user_profile() 
SET search_path = public;

-- Fix update_user_stats function
ALTER FUNCTION public.update_user_stats() 
SET search_path = public;
