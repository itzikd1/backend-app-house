#!/bin/bash

# Set your API base URL
API_URL="http://localhost:3000/api"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Register a new user
echo -e "${BLUE}1. Registering a new user...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}')

echo $REGISTER_RESPONSE

# Extract token from response (for Linux/Mac)
# TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# For Windows PowerShell, you'll need to extract the token manually from the response
# and set it here:
# $TOKEN="your_token_here"

echo -e "\n${BLUE}Please copy the token from the response above and set it in the script.${NC}
"
read -p "Paste the token here: " TOKEN

# 2. Get current user profile
echo -e "\n${GREEN}2. Getting current user profile...${NC}"
curl -X GET "$API_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN"

# 3. Create a family
echo -e "\n${BLUE}3. Creating a new family...${NC}"
FAMILY_RESPONSE=$(curl -s -X POST "$API_URL/families" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Smith Family"}')

echo $FAMILY_RESPONSE

# 4. Get family members
echo -e "\n${GREEN}4. Getting family members...${NC}"
curl -X GET "$API_URL/families/members" \
  -H "Authorization: Bearer $TOKEN"

# 5. Register a second user to test invitations
echo -e "\n${BLUE}5. Registering a second user...${NC}"
REGISTER_RESPONSE2=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Family Member","email":"member@example.com","password":"password123"}')

echo $REGISTER_RESPONSE2

# 6. Invite the second user to the family
echo -e "\n${BLUE}6. Inviting second user to the family...${NC}"
INVITE_RESPONSE=$(curl -s -X POST "$API_URL/families/invite" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"email":"member@example.com"}')

echo $INVITE_RESPONSE

# 7. Get updated family members list
echo -e "\n${GREEN}7. Getting updated family members list...${NC}"
curl -X GET "$API_URL/families/members" \
  -H "Authorization: Bearer $TOKEN"

# 8. Login as the second user to get their token
echo -e "\n${BLUE}8. Logging in as the second user...${NC}"
LOGIN_RESPONSE2=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"member@example.com","password":"password123"}')

echo $LOGIN_RESPONSE2

# Extract second user's token
# TOKEN2=$(echo $LOGIN_RESPONSE2 | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo -e "\n${BLUE}Please copy the token for the second user from the response above and set it in the script.${NC}\n"
read -p "Paste the second user's token here: " TOKEN2

# 9. Second user gets their profile to confirm family membership
echo -e "\n${GREEN}9. Second user gets their profile...${NC}"
curl -X GET "$API_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN2"

echo -e "\n${GREEN}Testing complete!${NC}"
