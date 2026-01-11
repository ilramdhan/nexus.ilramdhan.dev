-- ============================================
-- Storage Bucket Policies
-- Migration: 002_storage_policies.sql
-- ============================================

-- Drop existing policies to make the script idempotent
DROP POLICY IF EXISTS "Public read access for ilramdhan.dev" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can manage files in ilramdhan.dev" ON storage.objects;

-- Create policies for 'ilramdhan.dev' bucket
CREATE POLICY "Public read access for ilramdhan.dev"
ON storage.objects FOR SELECT
USING ( bucket_id = 'ilramdhan.dev' );

CREATE POLICY "Authenticated users can manage files in ilramdhan.dev"
ON storage.objects FOR ALL
TO authenticated
WITH CHECK ( bucket_id = 'ilramdhan.dev' );
