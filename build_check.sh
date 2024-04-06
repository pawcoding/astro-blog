#!/bin/bash

# Check if commit is a release commit
git show --oneline -s HEAD | grep 'chore(release):' 2>/dev/null

if [ $? -eq 0 ]; then
    # Build if release commit
    echo "✅ - Build can proceed"
    exit 1
fi

# Check if commit is of type article
git show --oneline -s HEAD | grep 'article(' 2>/dev/null

if [ $? -eq 0 ]; then
    # Build if article commit
    echo "✅ - Build can proceed"
    exit 1
fi

# Cancel build if not release commit
echo "🛑 - Master build, cancelled"
exit 0
