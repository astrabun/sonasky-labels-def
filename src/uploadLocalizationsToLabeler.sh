#!/bin/bash
export $(cat .env | xargs -L 1)
npx tsx src/uploadLocalizationsToLabeler.ts