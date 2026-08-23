-- Enable row level security for daily quality reports archive
ALTER TABLE IF EXISTS public.daily_quality_reports ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read bakery archived reports
CREATE POLICY IF NOT EXISTS "authenticated users can read bakery archives"
ON public.daily_quality_reports
FOR SELECT
TO authenticated
USING (department = 'bakery');

-- Allow authenticated users to update reports during review/edit workflow
CREATE POLICY IF NOT EXISTS "authenticated users can update bakery reports"
ON public.daily_quality_reports
FOR UPDATE
TO authenticated
USING (department = 'bakery')
WITH CHECK (department = 'bakery');
