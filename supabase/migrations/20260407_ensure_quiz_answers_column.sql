-- Ensure the answers and passed columns exist in quiz_attempts table
-- This migration handles cases where the columns might be missing or schema cache is stale

ALTER TABLE IF EXISTS public.quiz_attempts
ADD COLUMN IF NOT EXISTS answers JSONB DEFAULT '{}'::jsonb NOT NULL;

ALTER TABLE IF EXISTS public.quiz_attempts
ADD COLUMN IF NOT EXISTS passed BOOLEAN DEFAULT false NOT NULL;

-- Verify the table structure
DO $$
DECLARE
    answers_exists boolean;
    passed_exists boolean;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'quiz_attempts'
        AND column_name = 'answers'
    ) INTO answers_exists;

    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'quiz_attempts'
        AND column_name = 'passed'
    ) INTO passed_exists;

    IF answers_exists AND passed_exists THEN
        RAISE NOTICE 'answers and passed columns verified in quiz_attempts table';
    ELSE
        RAISE EXCEPTION 'Missing columns in quiz_attempts table: answers=% passed=%', answers_exists, passed_exists;
    END IF;
END $$;
