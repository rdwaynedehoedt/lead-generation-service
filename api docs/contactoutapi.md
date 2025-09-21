
### Introduction

### Authentication

### Rate limits

### LinkedIn Profile API

### People Enrich API

### HTTP Request

### Request Parameters

### Response Parameters

### Cost

### Contact Info API - Single

### Contact Info API - Bulk

### Company information from domains

### HTTP Request

### Query Parameters

### Response Parameters

### Cost

### People Search API

### HTTP Request

### Query Parameters

### Boolean Equations

### Response

### Cost

### People Count API

### HTTP Request

### Query Parameters

### Response

### Cost

### Access

### Decision Makers API

### HTTP Request

### Query Parameters

### Response Parameters

### Cost

### Company Search API

### HTTP Request

### Query Parameters

### Response Parameters

### Email to LinkedIn API

### HTTP Request

### Query Parameters

### Response Parameters

### Cost

### Contact Checker API


### Personal Email Checker

### Work Email Checker

### Phone Number Checker

### Email Verifier API

### Single

### Bulk

### API Usage Stats

### HTTP Request

### Query Parameters

### Postpaid

### Prepaid

### Errors

### Frequently Asked Questions

# Introduction

#### Welcome to ContactOut's API. Find anyone's email & phone number 10x faster with the most powerful sales and recruitment intelligence

#### software available.

# Authentication

#### To authorize, use this code:

```
# With shell, you can just pass the correct header with each request
curl "https://api.contactout.com" \
-H "authorization: basic"
-H "token: <YOUR_API_TOKEN>"
```
#### ContactOut uses API keys to allow access to the API. You can request an API key by booking a meeting here.

#### ContactOut expects the API key to be included in all API requests to the server in a header that looks like the following:

##### token : <YOUR_API_TOKEN>

##### RATE LIMITS

#### People Search API: 60 requests per minute

#### Contact Checker APIs: 150 requests per minute

#### Other APIs: 1000 requests per minute

# LinkedIn Profile API


## from LinkedIn URL

#### Get profile details for a single linkedin profile URL. The input only accepts LinkedIn regular URLs, not Sales Navigator or Talent / Recruiter

#### LinkedIn products.

#### This API allows you to retrieve various details such as email addresses, phone numbers, work experience, education, skills, and more

#### associated with a LinkedIn profile.

```
curl " https://api.contactout.com/v1/linkedin/enrich?profile=https://www.linkedin.com/in/example-person" \
--header "Content-Type: application/json" \
--header "Accept: application/json" \
--header "token: <YOUR_API_TOKEN>"
```
#### The above command returns JSON structured like this:

###### {

```
"status_code": 200 ,
"profile": {
```
(^) "url": (^) "https://www.linkedin.com/in/example-person",
"email": [
"email1@example.com",
"email2@gmail.com"
],
(^) "work_email": (^) [
"email1@example.com"
],
"personal_email": [
"email2@gmail.com"
(^) ],
"phone": [
"+1234567891"
],
"github": [
(^) "github_name"
],
"twitter": [
(^) "twitter_username"
],
(^) "full_name": (^) "Example Person",
"headline": "Manager, Business Operations & Marketing at OBM",
"industry": "Broadcast Media",
(^) "company": (^) {
"name": "Legros, Smitham and Kessler",
(^) "url": (^) "https://www.linkedin.com/company/legros-smitham-and-kessler",
"linkedin_company_id": 12345678 ,
"domain": "legros.com",
(^) "email_domain": (^) "legros.com",
"overview": "Legros, Smitham and Kessler is a publicly traded healthcare company specializing in pharmaceuticals, biotechnology, and medical devices. Founded in 2007
(^) "type": (^) "Public Company",
"size": 50 ,
"country": "United States",
(^) "revenue": (^6101000) ,
"founded_at": 2007 ,
(^) "industry": (^) "Healthcare",
"headquarter": "535 Kuhic Gardens Apt. 044",
"website": "http://www.legros.com",
(^) "logo_url": (^) "https://images.contactout.com/companies/voluptates",
"specialties": [
(^) "Healthcare",
"Medical",
"Pharmaceuticals",
(^) "Biotechnology",


"Medical Devices"

(^) ],
"locations": [
(^) "426 Lyda Unions, 551, Janniefort, New Hampshire, 56941-1470, Nicaragua",
"308 Cassandra Harbor Apt. 751, 78817, Darionburgh, Louisiana, 18743, Timor-Leste"
]
(^) },
"location": "Bermuda",
(^) "languages": (^) [
{
"name": "English",
(^) "proficiency": (^) "Full professional proficiency"
}
(^) ],
"country": "United States",
"summary": "An experienced professional with over 19 years in Marketing (digital, print, radio, television), Communications, Content Creation, Copy Writing, Website Mai
(^) "experience": (^) [
{
(^) "start_date": (^) "20204",
"end_date": "202112",
"title": "Manager, Business Operations & Marketing",
(^) "summary": (^) "Established in 1936, OBMI is a global master planning, architecture and design firm, with a rich history of shaping the architectural landscape of Bermu
"locality": "Hamilton, Bermuda",
"company_name": "OBM International",
"linkedin_url": "https://www.linkedin.com/company/obm-international",
"start_date_year": 2020 ,
(^) "start_date_month": (^4) ,
"end_date_year": 2021 ,
"end_date_month": 12 ,
"is_current": false
}
(^) ],
"education": [
{
"field_of_study": "Journalism",
"description": null,
(^) "start_date_year": (^) "2002",
"end_date_year": "2004",
"degree": "Journalism",
"school_name": "George Brown College"
}
],
"skills": [
"Digital Marketing",
"Content Creation",
"Business Development",
"Project Management",
"Client Relationship Management"
],
"certifications": [
{
"name": "Project Management Professional (PMP)",
"authority": "Project Management Institute",
"license": "12345678",
"start_date_year": 2018 ,
(^) "start_date_month": (^1) ,
"end_date_year": 2024 ,
"end_date_month": 1
}
],
(^) "publications": (^) [
{
"url": "https://example.com/publication1",
"title": "The Future of Digital Marketing",
"description": "An in-depth analysis of emerging trends in digital marketing and their impact on business growth.",
(^) "publisher": (^) "Marketing Monthly",
"authors": [
"Example Person",


```
"Co-Author Name"
```
(^) ],
"published_on_year": 2022 ,
(^) "published_on_month": (^5) ,
"published_on_day": 10
}
(^) ],
"projects": [
(^) {
"title": "Website Redesign Project",
"description": "Led a team of designers and developers to completely revamp the company's website, resulting in a 40% increase in user engagement.",
(^) "start_date_year": (^2019) ,
"start_date_month": 6 ,
(^) "end_date_year": (^2020) ,
"end_date_month": 2
}
(^) ],
"followers": 1000 ,
(^) "profile_picture_url": (^) "https://images.contactout.com/profiles/ca33f14227b1e5d3a1d53b0b5ca36fc8",
"updated_at": "2024-01-01 00:00:00"
}
}

#### Empty Results

###### {

```
"status_code": 200 ,
"profile": []
}
```
##### HTTP REQUEST

##### GET https://api.contactout.com/v1/linkedin/enrich?{profile=}

##### QUERY PARAMETERS

#### Parameter Type Description

#### profile

#### string, URL encoded,

#### required

#### The fully formed URL of the LinkedIn profile. URL must begin with http and must contain lin

#### kedin.com/in/ or linkedin.com/pub/

#### profile_only

#### boolean, optional,

#### default: false

#### If set to true, returns the profile data without contact information.

##### RESPONSE PARAMETERS

#### Field Type Description

#### status_code integer The HTTP status code of the response. Indicates the success or failure of the API request.

#### profile object Contains profile details related to the URL

#### url - The URL of the LinkedIn profile.

#### email - An array of email addresses associated with the profile.

#### work_email - An array of work email addresses associated with the profile.

#### personal_email An array of personal email addresses associated with the profile.


#### Field Type Description

#### phone - An array of phone numbers associated with the profile.

#### github - An array of GitHub usernames associated with the profile.

#### twitter - An array of Twitter usernames associated with the profile.

#### full_name - The full name of the profile owner.

#### headline The headline or job title of the profile owner.

#### industry - The industry in which the profile owner works.

#### company - An object containing information about the current company of the profile owner, including name,

#### URL, website, and headquarters location.

#### location - The location of the profile owner.

#### summary - A summary or description of the profile owner's professional background.

#### experience - An array of objects containing details about the profile owner's work experience, including start

#### and end dates, job title, description, and company LinkedIn URL.

#### education - An array of objects containing details about the profile owner's education, including institution

#### name, major, start and end dates, degrees, and profile URL.

#### skills - An array of skills associated with the profile owner.

#### certifications - An array of objects containing the certifications of the profile. Includes details like certification

#### name, company, authority, license number and date.

#### publications - An array of objects containing the publications of the profile. Includes details like publication

#### name, description and date.

#### projects - An array of objects containing the project details of the profile. Includes details like the project title,

#### description, start date/month and end date/month.

#### followers - The number of LinkedIn followers the profile has.

#### profile_picture_url - The URL of the profile picture of the profile owner.

#### updated_at - The date and time when the profile was last updated.

##### COST

#### Consumes 1 email credit if email is found and 1 phone credit if phone number is found.

#### Consumes 1 search credit if profile_only is set to true or if there is no contact information available for the requested profile.

## from email address

#### Get profile details for a single email address. The match rate is typically higher with a personal email address as they change less frequently.

#### For work emails, if the domain is from a past employer, the API checks previous work experience to ensure accurate identification.


curl "https://api.contactout.com/v1/email/enrich?email=0getfisher@gmail.com" \
--header "Content-Type: application/json" \
--header "Accept: application/json" \
--header "token: <YOUR_API_TOKEN>"

#### The above command returns JSON structured like this:

###### {

"status_code": 200 ,

(^) "profile": (^) {
"email": "0getfisher@gmail.com",
"workEmail": "work-email@obm-international.com",
(^) "workEmailStatus": (^) "Verified | Unverified",
"fullName": "Bobbi Singh",
(^) "headline": (^) "Manager, Business Operations & Marketing at OBM International",
"industry": "Broadcast Media",
"linkedinUrl": "https://www.linkedin.com/in/bobbisingh",
(^) "profilePictureUrl": (^) "https://images.contactout.com/profiles/ca33f14227b1e5d3a1d53b0b5ca36fc8",
"confidenceLevel": "",
(^) "altMatches": (^) [],
"phone": " +61.438347437",
"twitter": "",
(^) "github": (^) "",
"company": {
"name": "OBM International",
"url": "https://www.linkedin.com/company/obm-international",
"website": "http://obm.international",
(^) "linkedin_company_id": (^12345678) ,
"domain": "obm.international",
"email_domain": "obm.international",
"overview": "OBM International is a global master planning, architecture and design firm, with a rich history of shaping the architectural landscape of Bermuda. Found
"type": "Public Company",
(^) "size": (^50) ,
"country": "United States",
"revenue": 6101000 ,
"founded_at": 1936 ,
"industry": "Healthcare",
(^) "headquarter": (^) "HQ",
"logo_url": "https://images.contactout.com/companies/voluptates",
"specialties": [
"Healthcare",
"Medical",
(^) "Pharmaceuticals",
"Biotechnology",
"Medical Devices"
],
"locations": [
{
"city": "Miami",
"line1": "123 Business Ave",
"line2": "Suite 100",
"state": "Florida",
"country": "United States",
"postalCode": "33101",
"description": "Headquarters"
},
{
"city": "Hamilton",
"line1": "456 Front Street",
"line2": "",
"state": "",
(^) "country": (^) "Bermuda",
"postalCode": "HM 12",
"description": "Regional Office"


###### }

(^) ]
},
(^) "location": (^) "Bermuda",
"languages": [
{
(^) "name": (^) "English",
"proficiency": "Full professional proficiency"
(^) }
],
"summary": "An experienced professional with over 19 years in Marketing (digital, print, radio, television), Communications, Content Creation, Copy Writing, Website Mai
(^) "experience": (^) [
{
(^) "start_date": (^) "20204",
"end_date": "202112",
"title": "Manager, Business Operations & Marketing",
(^) "summary": (^) "Established in 1936, OBMI is a global master planning, architecture and design firm, with a rich history of shaping the architectural landscape of Bermu
"locality": "Hamilton, Bermuda",
(^) "company_name": (^) "OBM International",
"linkedin_url": "https://www.linkedin.com/company/obm-international",
"start_date_year": 2020 ,
(^) "start_date_month": (^4) ,
"end_date_year": 2021 ,
"end_date_month": 12 ,
"is_current": false
}
(^) ],
"education": [
{
"field_of_study": "Journalism",
"description": null,
(^) "start_date_year": (^) "2002",
"end_date_year": "2004",
"degree": "Journalism",
"school_name": "George Brown College"
}
(^) ],
"skills": [
"Digital Marketing",
"Content Creation",
"Business Development",
"Project Management",
"Client Relationship Management"
],
"certifications": [
{
"title": "Project Management Professional (PMP)",
"authority": "Project Management Institute",
"license": "12345678",
"start_date_year": 2018 ,
"start_date_month": 1 ,
"end_date_year": 2024 ,
"end_date_month": 1
}
],
(^) "publications": (^) [
{
"url": "https://example.com/publication1",
"title": "The Future of Digital Marketing",
"description": "An in-depth analysis of emerging trends in digital marketing and their impact on business growth.",
(^) "publisher": (^) "Marketing Monthly",
"authors": [
"Example Person",
"Co-Author Name"
],
(^) "published_on_year": (^2022) ,
"published_on_month": 5 ,
"published_on_day": 10


###### }

(^) ],
"projects": [
(^) {
"title": "Website Redesign Project",
"description": "Led a team of designers and developers to completely revamp the company's website, resulting in a 40% increase in user engagement.",
(^) "start_date_year": (^2019) ,
"start_date_month": 6 ,
(^) "end_date_year": (^2020) ,
"end_date_month": 2
}
(^) ],
"followers": 1000 ,
(^) "updatedAt": (^) "2024-01-01 00:00:00"
}
}

#### Empty Results

###### {

```
"status_code": 404 ,
"message": "Not Found"
}
```
##### HTTP REQUEST

##### GET https://api.contactout.com/v1/email/enrich?{email=}

##### QUERY PARAMETERS

#### Parameter Type Description

#### email string, required Email Address

#### include string, optional Data to be returned. Currently support work_email

###  Including include=work_email may increase the response time as real-time verification happens on the email provided to ensure

#### the quality of data.

##### RESPONSE PARAMETERS

#### Field Type Description

#### status_code integer The HTTP status code of the response. Indicates the success or failure of the API request.

#### profile object object containing all profile details associated with the email address. Also includes phone number if available.

#### email - The user's personal email address.

#### workEmail - The user's work email address. (if include=work_email in request)

#### workEmailStatus - The status of the work email address, whether it's verified or unverified

#### fullName - The full name of the user.

#### headline - The job title or professional headline of the user.


#### Field Type Description

#### industry - The industry in which the user works.

#### linkedinUrl - The LinkedIn profile URL of the user.

#### profilePictureUrl - The profile picture URL of the user.

#### confidenceLevel - Confidence level in the accuracy of the profile information.

#### altMatches - Alternative matches or suggestions related to the user's profile.

#### phone - The user's phone number.

#### twitter - The user's Twitter handle.

#### github - The user's GitHub username.

#### company - An object containing information about the user's current company.

#### name - The name of the user's company.

#### url - The LinkedIn URL of the company.

#### website - The website URL of the company.

#### headquarter- Location of the company's headquarters.

#### locations - An array containing details of the company's locations.

#### location - The current location of the user.

#### summary - A brief summary of the user's professional experience and skills.

#### experience - An array containing details of the user's work experience.

#### education - An array containing details of the user's educational background.

#### skills - An array containing the user's skills and expertise.

#### certifications - An array of objects containing the certifications of the profile. Includes details like certification

#### name, company, authority, license number and date.

#### publications - An array of objects containing the publications of the profile. Includes details like publication

#### name, description and date.

#### projects - An array of objects containing the project details of the profile. Includes details like the project title,

#### description, start date/month and end date/month.

#### followers - The number of LinkedIn followers the profile has.

#### updatedAt - The date and time when the profile was last updated.

##### COST

#### Consumes 1 email credit if email is found and 1 phone credit if phone number is found.


# People Enrich API

#### Get profile details using a combination of data points such as name, email, phone, LinkedIn URL, company information, education, and

#### location. This endpoint provides flexible enrichment by allowing you to provide multiple identifying parameters to find and enrich a

#### person's profile.

#### By default, this endpoint returns profile information without contact details. To include contact information such as email addresses and

#### phone numbers, you must specify the include parameter with the desired contact types.

```
curl -X POST "https://api.contactout.com/v1/people/enrich" \
--header "Content-Type: application/json" \
--header "Accept: application/json" \
--header "token: <YOUR_API_TOKEN>" \
--data '{
"full_name": "Jane Doe",
"first_name": "Jane",
"last_name": "Doe",
"email": "jane.doe@gmail.com",
"phone": "+14155552671",
"linkedin_url": "https://linkedin.com/in/janedoe",
"company": ["paypal", "stripe"],
"company_domain": "http://stripe.com",
"job_title": "Product Manager",
"location": "San Francisco, CA",
"education": ["University of Melbourne"],
"include": ["work_email", "personal_email", "phone"]
}'
```
#### The above command returns JSON structured like this:

###### {

```
"status_code": 200 ,
"profile": {
"url": "https://www.linkedin.com/in/example-person",
"email": [
```
(^) "email1@example.com",
"email2@gmail.com"
],
"work_email": [
"email1@example.com"
(^) ],
"personal_email": [
"email2@gmail.com"
],
"phone": [
(^) "+1234567891"
],
"github": [
"github_name"
],
(^) "twitter": (^) [
"twitter_username"
],
"full_name": "Example Person",
"headline": "Manager, Business Operations & Marketing at OBM",
"industry": "Broadcast Media",
"company": {
"name": "Legros, Smitham and Kessler",


"url": "https://www.linkedin.com/company/legros-smitham-and-kessler",

(^) "linkedin_company_id": (^12345678) ,
"domain": "legros.com",
(^) "email_domain": (^) "legros.com",
"overview": "Legros, Smitham and Kessler is a publicly traded healthcare company specializing in pharmaceuticals, biotechnology, and medical devices. Founded in 2007
"type": "Public Company",
(^) "size": (^50) ,
"country": "United States",
(^) "revenue": (^6101000) ,
"founded_at": 2007 ,
"industry": "Healthcare",
(^) "headquarter": (^) "535 Kuhic Gardens Apt. 044",
"website": "http://www.legros.com",
(^) "logo_url": (^) "https://images.contactout.com/companies/voluptates",
"specialties": [
"Healthcare",
(^) "Medical",
"Pharmaceuticals",
(^) "Biotechnology",
"Medical Devices"
],
(^) "locations": (^) [
"426 Lyda Unions, 551, Janniefort, New Hampshire, 56941-1470, Nicaragua",
"308 Cassandra Harbor Apt. 751, 78817, Darionburgh, Louisiana, 18743, Timor-Leste"
]
},
(^) "location": (^) "Bermuda",
"languages": [
{
"name": "English",
"proficiency": "Full professional proficiency"
(^) }
],
"country": "United States",
"summary": "An experienced professional with over 19 years in Marketing (digital, print, radio, television), Communications, Content Creation, Copy Writing, Website Mai
"experience": [
(^) {
"start_date": "20204",
"end_date": "202112",
"title": "Manager, Business Operations & Marketing",
"summary": "Established in 1936, OBMI is a global master planning, architecture and design firm, with a rich history of shaping the architectural landscape of Bermu
"locality": "Hamilton, Bermuda",
"company_name": "OBM International",
"linkedin_url": "https://www.linkedin.com/company/obm-international",
"start_date_year": 2020 ,
"start_date_month": 4 ,
"end_date_year": 2021 ,
"end_date_month": 12 ,
"is_current": false
}
],
"education": [
{
"field_of_study": "Journalism",
"description": null,
(^) "start_date_year": (^) "2002",
"end_date_year": "2004",
"degree": "Journalism",
"school_name": "George Brown College"
}
(^) ],
"skills": [
"Digital Marketing",
"Content Creation",
"Business Development",
(^) "Project Management",
"Client Relationship Management"
],


```
"certifications": [
```
(^) {
"name": "Project Management Professional (PMP)",
(^) "authority": (^) "Project Management Institute",
"license": "12345678",
"start_date_year": 2018 ,
(^) "start_date_month": (^1) ,
"end_date_year": 2024 ,
(^) "end_date_month": (^1)
}
],
(^) "publications": (^) [
{
(^) "url": (^) "https://example.com/publication1",
"title": "The Future of Digital Marketing",
"description": "An in-depth analysis of emerging trends in digital marketing and their impact on business growth.",
(^) "publisher": (^) "Marketing Monthly",
"authors": [
(^) "Example Person",
"Co-Author Name"
],
(^) "published_on_year": (^2022) ,
"published_on_month": 5 ,
"published_on_day": 10
}
],
(^) "projects": (^) [
{
"title": "Website Redesign Project",
"description": "Led a team of designers and developers to completely revamp the company's website, resulting in a 40% increase in user engagement.",
"start_date_year": 2019 ,
(^) "start_date_month": (^6) ,
"end_date_year": 2020 ,
"end_date_month": 2
}
],
(^) "followers": (^1000) ,
"profile_picture_url": "https://images.contactout.com/profiles/ca33f14227b1e5d3a1d53b0b5ca36fc8",
"updated_at": "2024-01-01 00:00:00"
}
}

#### Empty Results

###### {

```
"status_code": 404 ,
"message": "Not Found"
}
```
##### HTTP REQUEST

##### POST https://api.contactout.com/v1/people/enrich

##### REQUEST PARAMETERS

#### Primary Parameters :

#### Parameter Type Description

#### linkedin_url string, optional LinkedIn profile URL

#### email string, optional Email address


#### Parameter Type Description

#### phone string, optional Phone number

#### Name Parameters :

#### Parameter Type Description

#### full_name string, optional Full name of the person

#### first_name string, optional First name (must be used with last_name)

#### last_name string, optional Last name (must be used with first_name)

#### Secondary Parameters (required when using name parameters):

#### Parameter Type Description

#### company array, optional, max:10 Array of company names

#### company_domain array, optional, max:10 Array of company domains

#### education array, optional, max:10 Array of educational institutions

#### location string, optional Location/city

#### job_title string, optional Job title

#### Include Parameters :

#### Parameter Type Description

#### include array, optional Data to include: work_email, personal_email, phone

### ^ Parameter Requirements:

#### To return a match, the API requires:

- One primary identifier (linkedin_url, email, or phone)

#### OR

- A combination of name (e.g. full_name, or first_name + last_name) plus at least one secondary parameter (company, location, or edu

#### cation)

### ^ Contact Information:

#### By default, this endpoint returns profile data without contact information. To receive email addresses or phone numbers, you must

#### include the appropriate values in the include parameter.

##### RESPONSE PARAMETERS


#### Field Type Description

#### status_code integer The HTTP status code of the response. Indicates the success or failure of the API request.

#### profile object

#### Object containing all profile details associated with the provided parameters.

#### email - The user's personal email address.

#### workEmail - The user's work email address (if include=work_email in request).

#### workEmailStatus - The status of the work email address, whether it's verified or unverified.

#### fullName - The full name of the user.

#### headline - The job title or professional headline of the user.

#### industry - The industry in which the user works.

#### linkedinUrl - The LinkedIn profile URL of the user.

#### profilePictureUrl - The profile picture URL of the user.

#### confidenceLevel - Confidence level in the accuracy of the profile information.

#### altMatches - Alternative matches or suggestions related to the user's profile.

#### phone - The user's phone number.

#### twitter - The user's Twitter handle.

#### github - The user's GitHub username.

#### company - An object containing information about the user's current company including name, URL, website,

#### headquarters, locations, and other company details.

#### location - The current location of the user.

#### summary - A brief summary of the user's professional experience and skills.

#### experience - An array containing details of the user's work experience.

#### education - An array containing details of the user's educational background.

#### skills - An array containing the user's skills and expertise.

#### certifications - An array of objects containing the certifications of the profile.

#### publications - An array of objects containing the publications of the profile.

#### projects - An array of objects containing the project details of the profile.

#### followers - The number of LinkedIn followers the profile has.

#### updatedAt - The date and time when the profile was last updated.

##### COST

#### Consumes 1 search credit if a profile was found.


#### Consumes 1 email credit if email is found and 1 phone credit if phone number is found.

# Contact Info API - Single

## from LinkedIn Profile

#### Get contact details for a single LinkedIn profile. Requesting real-time work_emails via email_type=work may increase the response time. This

#### endpoint does not provide real-time verified work_email by default. If you need it in the response, you must pass the additional argument:

#### email_type.

###  The API does not support LinkedIn URLs from Sales Navigator or Recruiter because they can vary and change.

#### Common URLs include:

#### https://www.linkedin.com/sales/...

#### https://www.linkedin.com/talent/...

```
curl "https://api.contactout.com/v1/people/linkedin?profile=https://www.linkedin.com/in/example-person&include_phone=true" \
--header "Content-Type: application/json" \
--header "Accept: application/json" \
--header "token: <YOUR_API_TOKEN>"
```
#### The above command returns JSON structured like this:

###### {

```
"status_code": 200 ,
"profile": {
"url": "https://www.linkedin.com/in/example-person",
```
(^) "email": (^) [
"email1@example.com",
"email2@gmail.com"
],
"work_email": [
(^) "email1@example.com"
],
"work_email_status": {
"email1@example.com": "Verified | Unverified"
},
(^) "personal_email": (^) [
"email2@gmail.com"
],
"phone": [
"phone number 1"
],
"github": [
"github_name"
]
}
}


#### Empty Results

###### {

```
"status_code": 404 ,
"message": "Not Found"
}
```
##### HTTP REQUEST

##### GET https://api.contactout.com/v1/people/linkedin?{profile=&include_phone=}

##### QUERY PARAMETERS

#### Parameter Type Description

#### profile

#### profile: (string, URL

#### encoded, required)

#### The fully formed URL of the LinkedIn profile. URL must begin with http and must

#### contain linkedin.com/in/ or linkedin.com/pub/

#### include_phone

#### boolean, optional, Defaults

#### to false

#### If set to true, it will include phone information in the response and deduct phone

#### credits.

#### email_type string, optional

#### email_type="personal" — Returns only personal emails

#### email_type="work" — Returns only work emails

#### email_type="personal,work" — Returns both personal and work emails

#### By default, both personal and work emails are returned.

###  If email_type is not specified in the request, the response includes both personal and work emails. However, real-time verification

#### is only performed when email_type=work is explicitly included, which may yield more work email results but can increase response time.

##### RESPONSE PARAMETERS

#### Field Type Description

#### status_code integer The HTTP status code of the response.

#### profile object

#### An object containing contact details for the LinkedIn profile.

#### url - The URL of the LinkedIn profile.

#### email - An array of email addresses associated with the profile.

#### work_email - An array of work email addresses.

#### work_email_status - A dictionary indicating the verification status of work emails.

#### personal_email - An array of personal email addresses.

#### phone - An array of phone numbers associated with the profile.

#### github - An array of GitHub usernames associated with the profile.

##### COST


#### Consumes 1 email credit if email is found and 1 phone credit if phone number is found (and include_phone is set to true).

# Contact Info API - Bulk

## V1 Bulk ContactInfo

#### Get contact details for a batch of 30 LinkedIn Profiles per API call

```
curl 'https://api.contactout.com/v1/people/linkedin/batch' \
--header "Content-Type: application/json" \
--header "Accept: application/json" \
--header "token: <YOUR_API_TOKEN>"
--data '{
"profiles": [
"https://linkedin.com/in/example-person-1",
"https://linkedin.com/in/example-person-2",
"https://linkedin.com/in/example-person-3"
]
}'
```
#### The above command returns JSON structured like this:

###### {

(^) "status_code": (^200) ,
"profiles": {
"https://linkedin.com/in/example-person-1": [
"email1@example.com",
"email2@example.com",
(^) "email3@example.com"
],
"https://linkedin.com/in/example-person-2": [
"email1@domain.com"
],
(^) "https://linkedin.com/in/example-person-3": (^) [
"email1@website.com"
]
(^) }
}

#### If no contact info found

###### {

```
"status_code": 200 ,
"profiles": {
```
(^) "https://linkedin.com/in/example-person-1": (^) [],
"https://linkedin.com/in/example-person-2": [],
"https://linkedin.com/in/example-person-3": []
}
}

##### HTTP REQUEST

##### POST https://api.contactout.com/v1/people/linkedin/batch

##### QUERY PARAMETERS


#### Parameter Type Description

#### profiles

#### Array, required,

#### max:

#### An array of LinkedIn profile URLs. URL must begin with http and must contain linkedin.com/in/

#### or linkedin.com/pub/

##### RESPONSE PARAMETERS

#### Field Type Description

#### status_code integer The HTTP status code of the response. Indicates the success or failure of the API request.

#### profiles object

#### An object containing multiple LinkedIn profiles and their associated email addresses. Each profile URL serves as

#### a key in the profiles object, and the associated value is an array containing the email addresses associated

#### with that LinkedIn profile.

##### COST

#### Consumes 1 email credit per profile if email is found

## V2 Bulk ContactInfo

#### Improves upon v1 by incorporating ContactOut's real-time work email finder. If no work email is found in ContactOut's database, the system

#### attempts to guess and verify one in real-time.

#### This API enables users to retrieve contact details asynchronously through a background job process. Upon initiating the request, a j

#### ob_uuid is returned, which can be used to retrieve the results

#### The user can then retrieve the results in 2 ways:

#### 1. Callback URL: If an optional callback_urlis provided in the request parameters, we send a POST request to that URL with

#### the results once the job is complete.

#### 2. Direct Request: Users can call the following endpoint at any time using the job_uuid obtained from the initial request: GET h

##### ttps://api.contactout.com/v2/people/linkedin/batch/{job_uuid}

```
curl 'https://api.contactout.com/v2/people/linkedin/batch' \
--header "Content-Type: application/json" \
--header "Accept: application/json" \
--header "token: <YOUR_API_TOKEN>"
--data '{
"callback_url": "https://api.contactout.com/enrich-test-callback-endpoint",
"profiles": [
"https://linkedin.com/in/example-person-1",
"https://linkedin.com/in/example-person-2",
"https://linkedin.com/in/example-person-3"
],
"include_phone": true
}'
```
#### The above command returns JSON structured like this:

###### {

```
"status": "QUEUED",
```
(^) "job_id": (^) "96d1c156-fc66-46ef-b053-be6dbb45cf1f"
}

#### To get the contact information


```
curl "https://api.contactout.com/v2/people/linkedin/batch/96d1c156-fc66-46ef-b053-be6dbb45cf1f" \
--header "Content-Type: application/json" \
--header "Accept: application/json" \
--header "token: <YOUR_API_TOKEN>"
```
#### The above command returns JSON structured like this:

###### {

(^) "data": (^) {
"uuid": "96d1d610-f163-484e-a433-3006c862c14d",
(^) "status": (^) "SENT",
"result": {
"https://www.linkedin.com/in/example-person-1": {
(^) "emails": (^) [
"email1@example.com"
(^) ],
"personal_emails": [],
"work_emails": [
(^) "email1@example.com"
],
(^) "phones": (^) [
"+1234567890"
]
(^) },
"https://www.linkedin.com/in/example-person-2": {
"emails": [
"email2@example.com",
"email2@gmail.com"
(^) ],
"personal_emails": [
"email2@gmail.com"
],
"work_emails": [
(^) "email2@example.com"
],
"phones": []
},
"https://www.linkedin.com/in/example-person-3": {
(^) "emails": (^) [
"email3@example.com",
"email3@gmail.com"
],
"personal_emails": [
(^) "email3@gmail.com"
],
"work_emails": [
"email3@example.com"
],
"phones": [
"+0987654321"
]
}
}
}
}

##### HTTP REQUEST

##### POST https://api.contactout.com/v2/people/linkedin/batch

##### GET https://api.contactout.com/v2/people/linkedin/batch/{job_uuid}

##### QUERY PARAMETERS


#### Parameter Type Description

#### callback_url String, optional A URL where the results will be posted once the enrichment operation is completed.

#### profiles Array, required, Max:1000

#### An array of LinkedIn profile URLs. URL must begin with http and must contain linkedin.c

#### om/in/ or linkedin.com/pub/

#### include_phone

#### Boolean, optional,

#### default: false

#### If set to true, phone numbers will be included in the response if available. Requires phone

#### credits.

##### RESPONSE PARAMETERS

#### Field Type Description

#### uuid string

#### The unique identifier for the email lookup request. This uuid can be used to call the endpoint anytime and retrieve

#### results GET https://api.contactout.com/v2/people/linkedin/batch/{uuid}

#### status string The status of the email lookup request (e.g., "SENT" indicating the request has been sent)

#### result object

#### An object containing multiple LinkedIn profiles and their associated contact information.

#### emails - An array of all email addresses associated with the LinkedIn profile.

#### personal_emails - An array of personal email addresses associated with the LinkedIn profile.

#### work_emails - An array of work email addresses associated with the LinkedIn profile.

#### phones - An array of phone numbers associated with the LinkedIn profile (if include_phone is true).

##### COST

#### Consumes 1 email credit per profile if email is found

#### Consumes 1 phone credit per profile if include_phone is true and phone number is found

# Company information from domains

#### Get company information based on given input domains.

```
curl "https://api.contactout.com/v1/domain/enrich" \
--header "Content-Type: application/json" \
--header "Accept: application/json" \
--header "token: <YOUR_API_TOKEN>"
--data '{
"domains": [
"test.com"
]
}'
```
#### The above command returns JSON structured like this:


###### {

```
"status_code": 200 ,
```
(^) "companies": (^) [
{
(^) "contactout.com": (^) {
"li_vanity": "https://www.linkedin.com/company/test",
"name": "Test",
(^) "domain": (^) "test.com",
"description": "This company specializes in innovative software solutions to streamline business operations and enhance productivity.",
"website": "http://test.com",
"logo_url": "https://images.contactout.com/companies/328ffa89a83a83042329f8181b7fbfaf",
"type": "Privately Held",
(^) "headquarter": (^) "San Francisco, US",
"country": "United States",
"size": 89 ,
"founded_at": 2015 ,
"locations": [
(^) "San Francisco, US"
],
"industry": "Computer Software",
"specialties": [],
"revenue": "$5.4M"
(^) }
}
]
}

#### Empty Results

###### {

```
"status_code": 200 ,
"companies": []
}
```
##### HTTP REQUEST

##### POST https://api.contactout.com/v1/domain/enrich

##### QUERY PARAMETERS

#### Parameter Type Description

#### domains array, required, max:30 An array of domain names. Each domain should be in a valid format, for ex: example.com

##### RESPONSE PARAMETERS

#### Field Type Description

#### status_code integer HTTP status code indicating the success or failure of the request.

#### companies object An object containing information about the company associated with the provided domain.

#### company_domain - The domain name of the company, serving as the key for the company object.

#### li_vanity-LinkedIn vanity URL for the company.

#### name - Name of the company.

#### domain - Domain name of the company.


#### Field Type Description

#### description - Brief description of the company.

#### website - URL of the company's website.

#### logo_url - URL of the company's logo image.

#### type - Type of the company (e.g., Privately Held, Public).

#### headquarter - Headquarters location of the company.

#### country - Country where the company is located.

#### size - Size of the company (e.g., number of employees).

#### founded_at - Year the company was founded.

#### locations - Array containing locations where the company operates.

#### city - City of the location.

#### country - Country of the location.

#### isPrimary - Indicates if this location is the primary one.

#### industry - Industry in which the company operates.

#### specialties - Specialties or areas of expertise of the company

#### revenue - Revenue of the company.

##### COST

#### Does not consume credits

# People Search API

#### Get profiles matching the search criteria.

```
curl "https://api.contactout.com/v1/people/search" \
--header "Content-Type: application/json" \
--header "Accept: application/json" \
--header "token: <YOUR_API_TOKEN>"
--data '
{
"page": 1,
"name": "John Smith",
"job_title": [
"Vice President",
"VP Of Product"
],
"exclude_job_titles": [
"Sales"
],
```

"current_titles_only": false,
"include_related_job_titles": false,
"skills": [
"Network Security",
"Networking"
],
"education": [
"Doctorate Degree",
"Vertapple University"
],
"location": [
"Sydney, Australia"
],
"company": [
"ContactOut"
],
"company_filter": "both",
"exclude_companies": [
"Google"
],
"match_experience": "current",
"domain":[
"https://contactout.com"
],
"industry": [
"Computer Software",
"Computer Networking"
],
"keyword": "Computer Networking",
"company_size": [
"1_10",
"11_50"
],
"years_of_experience": [
"6_10",
"10"
],
"years_in_current_role": [
"8_10",
"10"
],
"current_company_only": false,
"data_types" : [
"personal_email",
"work_email",
"phone"
],
"reveal_info" : true
}
'

#### The above command returns JSON structured like this:

###### {

"status_code": 200 ,
"metadata": {
"page": 1 ,

(^) "page_size": (^25) ,
"total_results": 45
},
"profiles": {
"https://linkedin.com/in/at-JqjtXv": {
"li_vanity": "at-JqjtXv",
"full_name": "Llewellyn Ruecker",
"title": "Research Assistant",
"headline": "Research Assistant at Legros, Smitham and Kessler",


"company": {

(^) "name": (^) "Legros, Smitham and Kessler",
"url": "https://www.linkedin.com/company/legros-smitham-and-kessler",
(^) "domain": (^) "legros.com",
"email_domain": "legros.com",
"overview": "Legros, Smitham and Kessler is a publicly traded healthcare company specializing in pharmaceuticals, biotechnology, and medical devices. Founded in 200
(^) "type": (^) "Public Company",
"size": 50 ,
(^) "country": (^) "United States",
"revenue": 6101000 ,
"founded_at": 2007 ,
(^) "industry": (^) "Healthcare",
"headquarter": "535 Kuhic Gardens Apt. 044",
(^) "website": (^) "http://www.legros.com",
"logo_url": "https://images.contactout.com/companies/voluptates",
"specialties": [
(^) "Healthcare",
"Medical",
(^) "Pharmaceuticals",
"Biotechnology",
"Medical Devices"
(^) ],
"locations": [
"426 Lyda Unions, 551, Janniefort, New Hampshire, 56941-1470, Nicaragua",
"308 Cassandra Harbor Apt. 751, 78817, Darionburgh, Louisiana, 18743, Timor-Leste"
]
(^) },
"location": "Faheybury",
"country": "United States",
"industry": "Dr. Trenton Hane III",
"experience": [
(^) "Research Assistant at Legros, Smitham and Kessler in 2014 - Present"
],
"education": [
"Doctorate Degree at Vertapple University in 2017 - 2021"
],
(^) "skills": (^) [
"Research",
"Algorithms",
"Budget Planning",
"Storage",
"Requirements Gathering",
"Coding"
],
"summary": "An experienced professional with over 19 years in Marketing (digital, print, radio, television), Communications, Content Creation, Copy Writing, Website M
"languages": [
{
"name": "English",
"proficiency": "Full professional proficiency"
}
],
"certifications": [
{
"name": "Project Management Professional (PMP)",
"authority": "Project Management Institute",
(^) "license": (^) "12345678",
"start_date_year": 2018 ,
"start_date_month": 1 ,
"end_date_year": 2024 ,
"end_date_month": 1
(^) }
],
"publications": [
{
"url": "https://example.com/publication1",
(^) "title": (^) "The Future of Digital Marketing",
"description": "An in-depth analysis of emerging trends in digital marketing and their impact on business growth.",
"publisher": "Marketing Monthly",


```
"authors": [
```
(^) "Example Person",
"Co-Author Name"
(^) ],
"published_on_year": 2022 ,
"published_on_month": 5 ,
(^) "published_on_day": (^10)
}
(^) ],
"projects": [
{
(^) "title": (^) "Website Redesign Project",
"description": "Led a team of designers and developers to completely revamp the company's website, resulting in a 40% increase in user engagement.",
(^) "start_date_year": (^2019) ,
"start_date_month": 6 ,
"end_date_year": 2020 ,
(^) "end_date_month": (^2)
}
(^) ],
"followers": 1000 ,
"updated_at": "2023-03-31 00:00:00",
(^) "profile_picture_url": (^) "https://images.contactout.com/profiles/ca33f14227b1e5d3a1d53b0b5ca36fc8",
"contact_availability": {
"personal_email": true,
"work_email": true,
"phone": true
(^) },
"contact_info": {
"emails": [
"test@gmail.com",
"email1@example.com"
(^) ],
"personal_emails": [
"test@gmail.com"
],
"work_emails": [
(^) "email1@example.com"
],
"work_email_status": {
"email1@example.com": "Verified | Unverified"
},
"phones": [
"+123456789"
]
}
}
}
}

#### No matching profiles

###### {

```
"status_code": 200 ,
```
(^) "metadata": (^) {
"page": 1 ,
"page_size": 25 ,
"total_results": 0
},
(^) "profiles": (^) []
}

##### HTTP REQUEST

##### POST https://api.contactout.com/v1/people/search


##### QUERY PARAMETERS

#### Parameter Type Description

#### Accepts

#### Boolean

#### name text Name of the profile No

#### job_title array, max:50 Accepts an array of job titles. Yes

#### current_titles_only

#### boolean,

#### default: true

#### Returns profiles matching the current job title. If specified false, the

#### response will return profiles matching the current or past job title.

#### No

#### include_related_job_titles

#### boolean,

#### default: false

#### Returns profiles with related job titles No

#### match_experience

#### string, default:

#### current

#### Ensures job_title and company match in the same experience.

#### current – Returns profiles that match the current experience.

#### past – Returns profiles that matches any past experience.

#### both – Returns profiles matching either current or past experience.

#### If set, current_titles_only and company_filter should not be used. API will

#### return an error in that case.

#### No

#### skills array, max:50 Accepts an array of skills Yes

#### education array, max:50 Accepts an array of schools/degrees Yes

#### location array, max:50 Accepts an array of locations No

#### company array, max:50 Accepts an array of company names No

#### company_filter

#### string, default:

##### current

#### current – Returns profiles matching the current company name

#### past – Returns profiles matching any past company name

#### both – Returns profiles matching either current or past experience

#### No

#### current_company_only

#### boolean,

#### default: true

#### Returns profiles matching the current company name No

#### domain array, max:50 Accepts an array of domains No

#### industry array, max:50 Accepts an array of industries. Accepted values list Yes

#### keyword text

#### Returns profiles that contain the mentioned keyword anywhere in their

#### profile

#### Yes

#### company_size array Accepts an array of company size ranges. Accepted values list No

#### years_of_experience array

#### Accepts an array representing ranges of years of experience. Accepted

#### values list

#### No

#### years_in_current_role array

#### Accepts an array representing ranges of years in current role. Accepted

#### values list

#### No


#### Parameter Type Description

#### Accepts

#### Boolean

#### page integer Provides results for the given page No

#### data_types array

#### Returns profiles containing atleast one of the specified data types. It

#### accepts an array of one more values from this list [personal_email, work_em

##### ail, phone]

#### No

#### reveal_info

#### boolean,

#### default: false

#### If set to true, contact_info will contain the emails and phone numbers of

#### the profile and credits will be charged

#### No

##### BOOLEAN EQUATIONS

#### Few input parameters mentioned in the table above can accept boolean equations as input. Check the "Accepts Boolean" column to know

#### which input fields can accept boolean equations. You can use boolean equations to filter based on a specific criteria.

#### e.g. If you are looking for profiles who have the skills ReactJS and Python, but not Java, you can format the skills parameter as: { "skills":

#### ["(ReactJS AND Python) NOT Java"] }. Always add brackets to ensure the boolean logic is applied correctly.

#### The same logic will apply for the rest of the mentioned paramters.

#### The supported boolean operators are:

#### OR

#### AND

#### NOT

##### RESPONSE

#### Response contains the meta information and the matching list of profiles. Each profile contains the information like title, headline, company

#### details, experience, skills etc. It also lists the contact availability and contact information fields.

#### Parameter Type Description

#### contact_info array Returns an array containing contact information including email and phone numbers

#### contact_availability array Returns an array determining whether the profile contains the contact information

#### summary text A brief overview of the person's professional background and expertise

#### languages array List of languages with name and proficiency level

#### certifications array List of certifications with name, authority, license, and validity dates

#### publications array List of publications with title, description, URL, publisher, authors and publication date

#### projects array List of projects with title, description and date ranges

#### For customizing the output fields, use the below command with list of fields to be returned in the output:

```
curl "https://api.contactout.com/v1/people/search" \
--header "Content-Type: application/json" \
--header "Accept: application/json" \
--header "token: <YOUR_API_TOKEN>"
--data '
{
"page": 1,
"name": "John Smith",
```

```
"output_fields" : [
"title",
"li_vanity"
]
}
```
#### The above command returns JSON structured like this:

###### {

(^) "status_code": (^200) ,
"metadata": {
"page": 1 ,
(^) "page_size": (^25) ,
"total_results": 0
(^) },
"profiles": {
"https://linkedin.com/in/at-JqjtXv": {
(^) "li_vanity": (^) "at-JqjtXv",
"title": "Research Assistant",
(^) "contact_availability": (^) {
"personal_email": true,
"work_email": true,
(^) "phone": (^) true
},
(^) "contact_info": (^) {
"emails": [],
"personal_emails": [],
(^) "work_emails": (^) [],
"work_email_status": [],
(^) "phones": (^) []
}
}
(^) }
}

##### COST

#### Consumes 1 search credit for each profile returned.

#### Consumes 1 email/phone credit for every profile where email/phone info is found, if reveal_info=true is specified.

# People Count API

#### Get the total count of profiles matching the search criteria.

```
curl "https://api.contactout.com/v1/people/count" \
--header "Content-Type: application/json" \
--header "Accept: application/json" \
--header "token: <YOUR_API_TOKEN>"
--data '
{
"job_title": [
"Vice President",
"VP Of Product"
],
"company": [
"ContactOut"
],
```

```
"location": [
"Sydney, Australia"
]
}
'
```
#### The above command returns JSON structured like this:

###### {

(^) "status_code": (^200) ,
"total_results": 100000
}

##### HTTP REQUEST

##### POST https://api.contactout.com/v1/people/count

##### QUERY PARAMETERS

#### This endpoint accepts the same parameters as the People Search API, except for page, data_types, and reveal_info.

##### RESPONSE

#### Response contains the total count of profiles matching the search criteria.

#### Parameter Type Description

#### status_code integer HTTP status code of the response

#### total_results integer Total number of profiles matching the search criteria

##### COST

#### Does not consume credits

##### ACCESS

#### Only available to paid users

# Decision Makers API

#### Get profiles of key decision makers within a specified company.

```
curl "https://api.contactout.com/v1/people/decision-makers?reveal_info=true&linkedin_url=https://linkedin.com/company/contactout" \
--header "Content-Type: application/json" \
--header "Accept: application/json" \
--header "token: <YOUR_API_TOKEN>"
```
#### The above command returns JSON structured like this:

###### {

(^) "status_code": (^200) ,
"metadata": {
"page": 1 ,


"page_size": 25 ,

(^) "total_results": (^8)
},
(^) "profiles": (^) {
"https://www.linkedin.com/in/rob-liu": {
"full_name": "Rob Liu",
(^) "li_vanity": (^) "robliu",
"title": "CEO / Founder",
(^) "headline": (^) "Founder at Contactout",
"company": {
"name": "ContactOut",
(^) "website": (^) "http://contactout.com",
"domain": "contactout.com",
(^) "email_domain": (^) "contactout.com",
"headquarter": "San Francisco, US",
"size": 96 ,
(^) "revenue": (^10000) ,
"industry": "Computer Software"
(^) },
"location": "Singapore",
"industry": "Computer Software",
(^) "experience": (^) [
"CEO / Founder at ContactOut in 2015 - Present",
"Limited Partner at Blackbird in 2020 - Present",
"Limited Partner at Hustle Fund in 2021 - Present",
"Visiting Partner at Iterative in 2023 - Present"
(^) ],
"education": [
"UNSW in 2008 - 2011"
],
"skills": [
(^) "Start-ups",
"Entrepreneurship",
"Online Advertising",
"Social Media Marketing",
"Digital Marketing",
(^) "Web Analytics",
"Digital Media",
"Project Management",
"Laravel",
"Test Driven Development"
],
"updated_at": "2024-04-03 17:15:14",
"profile_picture_url": "https://images.contactout.com/profiles/ca33f14227b1e5d3a1d53b0b5ca36fc8",
"contact_availability": {
"work_email": true,
"personal_email": true,
"phone": true
},
"contact_info": {
"emails": [
"test@gmail.com",
"email1@example.com"
],
"personal_emails": [
(^) "test@gmail.com"
],
"work_emails": [
"email1@example.com"
],
(^) "work_email_status": (^) {
"email1@example.com": "Verified"
},
"phones": [
"+123456789"
(^) ]
}
}


###### }

###### }

##### HTTP REQUEST

##### GET https://api.contactout.com/v1/people/decision-makers?{domain=&name=&linkedin_url=&reveal_info=}

##### QUERY PARAMETERS

#### This endpoint requires at least one of the following three parameters: linkedin_url, domain, or name. The endpoint accepts any

#### combination of these parameters to identify the most relevant company match.

#### Parameter Type Description

#### linkedin_url

#### string,

#### optional

#### The fully formed URL of the company's LinkedIn profile. URL must begin with http and must contain

#### linkedin.com/company/. Accepts both the numeric or string version of the URL, e.g. https://linkedin.com/

#### company/contactout or https://linkedin.com/company/27090845

#### domain

#### string,

#### optional

#### The domain name of the company's website, e.g. example.com

#### name

#### string,

#### optional

#### The name of the company

#### page

#### integer,

#### optional

#### Provides results for the given page

#### reveal_info

#### boolean,

#### default: false

#### If set to true, contact_info will contain the emails and phone numbers of the profile and credits will be

#### charged

##### RESPONSE PARAMETERS

#### Response contains the meta information and the matching list of profiles. Each profile contains the information like title, headline, company

#### details, experience, skills etc. It also lists the contact availability and contact information fields.

#### Field Type Description

#### contact_info array Returns an array containing contact information including email and phone numbers

#### contact_availability array Returns an array determining whether the profile contains the contact information

##### COST

#### Consumes 1 email/phone credit for every profile where email/phone info is found, if reveal_info=true is specified.

# Company Search API

#### Get company profiles matching the search criteria.

```
curl "https://api.contactout.com/v1/company/search" \
--header "Content-Type: application/json" \
--header "Accept: application/json" \
--header "token: <YOUR_API_TOKEN>"
```

#####  

```
--data '
{
"page": 1,
"name": ["ContactOut"],
"domain": ["contactout.com"],
"size": ["1_10"],
"hq_only": false,
"location": ["United States"],
"industry": ["Software"],
"min_revenue": 1000000,
"max_revenue": 50000000,
"year_founded_from": 2000,
"year_founded_to": 2024
}
'
```
#### The above command returns JSON structured like this:

###### {

(^) "status_code": (^200) ,
"metadata": {
"page": 1 ,
(^) "page_size": (^25) ,
"total_results": 1
(^) },
"companies": [
{
(^) "name": (^) "ContactOut",
"url": "https://linkedin.com/company/contactout",
(^) "domain": (^) "contactout.com",
"email_domain": "contactout.com",
"overview": "At ContactOut, we pride ourselves on being the most accurate contact data intelligence tool out there. Find emails and phone numbers for 300M professiona
(^) "type": (^) "Privately Held",
"size": 96 ,
(^) "country": (^) "United States",
"revenue": 10000000 ,
"founded_at": 2015 ,
(^) "industry": (^) "Computer Software",
"headquarter": "San Francisco, California",
"website": "http://contactout.com",
"location": "San Francisco US",
"logo_url": "https://images.contactout.com/companies/328ffa89a83a83042329f8181b7fbfaf",
(^) "specialties": (^) [
"Lead Generation",
"Recruitment",
"Computer Software"
],
(^) "locations": (^) [
"San Francisco, US"
]
}
]
}

#### No matching company profiles

###### {

```
"status_code": 200 ,
"metadata": {
"page": 1 ,
"page_size": 25 ,
"total_results": 0
},
```

```
"companies": []
}
```
##### HTTP REQUEST

##### POST https://api.contactout.com/v1/company/search

##### QUERY PARAMETERS

#### Parameter Type Description

#### Accepts

#### Boolean

#### name array, max:50 Accepts an array of company names No

#### domain array, max:50 Accepts an array of company domains No

#### size array Company size by number of employees. Accepted values list No

#### hq_only boolean Filter search locations by headquarters only No

#### location array, max:50 Accepts an array of locations No

#### industries array, max:50 Accepts an array of industries. Accepted values list No

#### min_revenue integer Minimum revenue of the company Accepted values list No

#### max_revenue integer Maximum revenue of the company Accepted values list No

#### year_founded_from integer, min:1985 Minimum year founded of the company No

#### year_founded_to

#### integer, max: current

#### year

#### Maximum year founded of the company. Requires year_founded_f

#### rom.

#### No

##### RESPONSE PARAMETERS

#### Field Type Description

#### status_code integer The HTTP status code of the response. Indicates the success or failure of the API request.

#### companies array Contains company profile details that matched the search.

#### name - Name of the company.

#### url - The LinkedIn URL of the company.

#### domain - Domain name of the company.

#### email_domain - Email domain of the company.

#### overview - Brief description of the company.

#### type - Type of the company (e.g., Privately Held, Public).

#### size - Size of the company (e.g., number of employees).

#### country - Country where the company is located.

#### revenue - Revenue of the company


#### Field Type Description

#### founded_at - Year the company was founded.

#### industry - Industry in which the company operates.

#### headquarter - Headquarters location of the company.

#### website - URL of the company's website.

#### location - The location of the company.

#### logo_url - The URL of the company logo.

#### specialties - Specialties or areas of expertise of the company.

#### locations - Array containing locations where the company operates.

# Email to LinkedIn API

#### Get LinkedIn profile url for a given email

```
curl "https://api.contactout.com/v1/people/person?email=terry@gmail.com" \
--header "Content-Type: application/json" \
--header "Accept: application/json" \
--header "token: <YOUR_API_TOKEN>"
```
#### The above command returns JSON structured like this:

###### {

```
"status_code": 200 ,
"profile": {
"email": "terry@gmail.com",
"linkedin": "https://www.linkedin.com/in/terry"
}
}
```
#### Empty Results

###### {

```
"status_code": 404 ,
"message": "Not Found"
}
```
##### HTTP REQUEST

##### GET https://api.contactout.com/v1/people/person?{email=}

##### QUERY PARAMETERS


#### Parameter Type Description

#### email string, required Email Address

##### RESPONSE PARAMETERS

#### Field Type Description

#### status_code integer HTTP status code indicating the success or failure of the request.

#### profile object

#### An object containing basic information about the user's profile.

#### email (string) - Email address associated with the user's profile.

#### linkedin (string) - LinkedIn profile URL of the user.

##### COST

#### Consumes 1 email credit if profile is found.

# Contact Checker API

## Personal Email Checker

#### Get personal email availability status for a single Linkedin profile

```
curl "https://api.contactout.com/v1/people/linkedin/personal_email_status?profile=https://www.linkedin.com/in/example-person" \
--header "authorization: basic" \
--header "token: <YOUR_API_TOKEN>"
```
#### The above command returns JSON structured like this:

###### {

```
"status_code": 200 ,
"profile": {
"email": true
}
}
```
##### HTTP REQUEST

##### GET https://api.contactout.com/v1/people/linkedin/personal_email_status?{profile=}

##### QUERY PARAMETERS

#### Parameter Type Description

#### profile

#### profile: (string, URL encoded,

#### required)

#### The fully formed URL of the LinkedIn profile. URL must begin with http and must contain

#### linkedin.com/in/ or linkedin.com/pub/


##### RESPONSE PARAMETERS

#### Field Type Description

#### status_code integer The HTTP status code of the response. Indicates the success or failure of the API request.

#### profile object

#### Contains personal email availability status for a single LinkedIn profile.

#### email - returns true if personal email is present

##### COST

#### Does not consume credits

##### ACCESS

#### Only available to paid users

## Work Email Checker

#### Get work email availability status for a single LinkedIn profile

```
curl "https://api.contactout.com/v1/people/linkedin/work_email_status?profile=https://www.linkedin.com/in/example-person" \
--header "authorization: basic" \
--header "token: <YOUR_API_TOKEN>"
```
#### The above command returns JSON structured like this:

###### {

```
"status_code": 200 ,
"profile": {
```
(^) "email": (^) true,
"email_status": "Verified | Unverified | null"
}
}

##### HTTP REQUEST

##### GET https://api.contactout.com/v1/people/linkedin/work_email_status?{profile=}

##### QUERY PARAMETERS

#### Parameter Type Description

#### profile

#### profile: (string, URL encoded,

#### required)

#### The fully formed URL of the LinkedIn profile. URL must begin with http and must contain

#### linkedin.com/in/ or linkedin.com/pub/.

##### RESPONSE PARAMETERS

#### Field Type Description

#### status_code integer The HTTP status code of the response. Indicates the success or failure of the API request.

#### profile object Contains work email availability status for a single LinkedIn profile.


#### Field Type Description

#### email - returns true if work email is present

#### email_status - returns whether the email is verified or unverified.

##### COST

#### Does not consume credits

##### ACCESS

#### Only available to paid users

## Phone Number Checker

#### Get phone availability status for a single LinkedIn profile

```
curl "https://api.contactout.com/v1/people/linkedin/phone_status?profile=https://www.linkedin.com/in/example-person" \
--header "authorization: basic" \
--header "token: <YOUR_API_TOKEN>"
```
#### The above command returns JSON structured like this:

###### {

```
"status_code": 200 ,
"profile": {
```
(^) "phone": (^) true
}
}

##### HTTP REQUEST

##### GET https://api.contactout.com/v1/people/linkedin/phone_status?{profile=}

##### QUERY PARAMETERS

#### Parameter Type Description

#### profile

#### profile: (string, URL encoded,

#### required)

#### The fully formed URL of the LinkedIn profile. URL must begin with http and must contain

#### linkedin.com/in/ or linkedin.com/pub/

##### RESPONSE PARAMETERS

#### Field Type Description

#### status_code integer The HTTP status code of the response. Indicates the success or failure of the API request.

#### profile object

#### Contains phone number availability status for a single LinkedIn profile.

#### phone - returns true if phone number is present

##### COST

#### Does not consume credits


##### ACCESS

#### Only available to paid users

# Email Verifier API

## Single

#### Verify the deliverability of an email address

```
curl "https://api.contactout.com/v1/email/verify?email=foo@bar.com" \
--header "Content-Type: application/json" \
--header "Accept: application/json" \
--header "token: <YOUR_API_TOKEN>"
```
#### The above command returns JSON structured like this:

###### {

(^) "status_code": (^200) ,
"data": {
(^) "status": (^) "valid"
}
}

##### HTTP REQUEST

##### GET https://api.contactout.com/v1/email/verify?{email=}

##### QUERY PARAMETERS

#### Parameter Type Description

#### email string, required Email Address

##### RESPONSE

#### status returns the status of the email address. Below are the possible values

#### valid: the email address is valid.

#### invalid: the email address is not valid.

#### accept_all: the email address is valid but any email address is accepted by the server.

#### disposable: the email address comes from a disposable email service provider.

#### unknown: we failed to verify the email address.

##### COST

#### Consumes 1 “verifier” credit if result is either valid, invalid or accept_all

## Bulk


#### Verify the deliverability for a batch of 100 email addresses in bulk.

```
curl 'https://api.contactout.com/v1/email/verify/batch' \
--header "Content-Type: application/json" \
--header "Accept: application/json" \
--header "token: <YOUR_API_TOKEN>"
--data '{
"callback_url": "https://api.contactout.com/enrich-test-callback-endpoint",
"emails": [
"test1@gmail.com",
"test2@contactout.com",
"test3@yahoo.com"
]
}'
```
#### The above command returns JSON structured like this:

###### {

(^) "status": (^) "QUEUED",
"job_id": "96d1c156-fc66-46ef-b053-be6dbb45cf1f"
}

#### To get the data

```
curl "https://api.contactout.com/v1/email/verify/batch/96d1c156-fc66-46ef-b053-be6dbb45cf1f" \
--header "Content-Type: application/json" \
--header "Accept: application/json" \
--header "token: <YOUR_API_TOKEN>"
```
#### The above command returns JSON structured like this:

###### {

```
"data": {
"uuid": "992d8707-aa77-4499-92e4-cf3579c1d384",
"status": "DONE",
"result": {
```
(^) "test1@gmail.com": (^) "valid",
"test2@contactout.com": "accept_all",
"test3@gmail.com": "invalid"
}
}
}

##### HTTP REQUEST

##### POST https://api.contactout.com/v1/email/verify/batch

##### GET https://api.contactout.com/v1/email/verify/batch/{job_uuid}

##### QUERY PARAMETERS

#### Parameter Type Description

#### callback_url String, optional

#### A URL where the results will be posted once the bulk email verification operation is

#### completed.

#### emails

#### Array, required,

#### Max:1000

#### An array of email addresses


##### RESPONSE PARAMETERS

#### Field Type Description

#### uuid string The unique identifier associated with the email verification request.

#### status string The status of the email verification process. "DONE": Indicates that the email verification process has been completed.

#### result object

#### An object containing the results of the email verification process, indexed by email addresses.

#### Below are the possible values for verification status

#### valid - the email address is valid.

#### invalid - the email address is not valid.

#### accept_all - the email address is valid but any email address is accepted by the server.

#### disposable - the email address comes from a disposable email service provider.

#### unknown we failed to verify the email address.

##### COST

#### Consumes 1 “verifier” credit per email if result is either valid, invalid or accept_all

# API Usage Stats

#### Get API stats for the given period.

##### HTTP REQUEST

##### GET https://api.contactout.com/v1/stats?period=2023-04

##### QUERY PARAMETERS

#### Parameter Type Description

#### period

#### string, YYYY-MM format, defaults to current

#### month

#### Accepts month in YYYY-MM format, which returns the stats of the given

#### month

## Postpaid

##### RESPONSE

```
curl "https://api.contactout.com/v1/stats?period=2023-04" \
--header "authorization: basic" \
--header "token: <YOUR_API_TOKEN>"
```
#### The above command returns JSON structured like this:


###### {

```
"status_code": 200 ,
```
(^) "period": (^) {
"start": "2023-04-01",
(^) "end": (^) "2023-04-31"
},
"usage": {
(^) "count": (^100) ,
"quota": 200 ,
"remaining": 100 ,
"over_quota": 0 ,
"phone_count": 500 ,
(^) "phone_quota": (^1000) ,
"phone_remaining": 500 ,
"phone_over_quota": 0 ,
"search_count": 100 ,
"search_quota": 200 ,
(^) "search_remaining": (^100) ,
"search_over_quota": 0
}
}

#### Key Type Description

#### count integer Successful API requests that used an email credit

#### quota integer Allowed email credit usage before either overage is charged or key is disabled until next period

#### remaining integer Calculated as quota - count

#### over_quota integer Overages on email credit usage(only applicable to some users)

#### phone_count integer Successful API requests that used a phone credit

#### phone_quota integer Allowed phone credit usage before either overage is charged or key is disabled until next period

#### phone_remaining integer Calculated as phone_quota - phone_count

#### phone_over_quota integer Overages on phone credit usage (only applicable to some users)

#### search_count integer Successful API requests that used a search credit

#### search_quota integer Allowed search credit usage before either overage is charged or key is disabled until next period

#### search_remaining integer Calculated as search_quota - search_count

#### search_over_quota integer Overages on search credit usage (only applicable to some users)

## Prepaid

##### RESPONSE

```
curl "https://api.contactout.com/v1/stats?period=2023-04" \
--header "authorization: basic" \
```

```
--header "token: <YOUR_API_TOKEN>"
```
#### The above command returns JSON structured like this:

###### {

```
"status_code": 200 ,
"period": {
"start": "2023-04-01",
"end": "2023-04-31"
```
(^) },
"usage": {
"count": 100 ,
(^) "quota": (^200) ,
"phone_count": 500 ,
(^) "phone_quota": (^1000) ,
"search_count": 100 ,
"search_quota": 200
(^) }
}

#### Key Type Description

#### count integer Successful API requests that used an email credit

#### quota integer Prepaid Email credits remaining

#### phone_count integer Successful API requests that used a phone credit

#### phone_quota integer Prepaid Phone credits remaining

#### search_count integer Successful API requests that used a search credit

#### search_quota integer Prepaid Search credits remaining

# Errors

#### ContactOut APIs returns the following error codes:

#### Error Code Message

#### 400 Bad credentials or invalid headers

#### 401 Bad request or invalid input

#### 403 You're out of credits, please email your sales manager

#### 403 No access to endpoint

#### 429 Rate limit reached. Check header retry-after: <time_in_seconds> for when rate limit will reset


# Frequently Asked Questions

#### You can view answers for some of the most commonly asked questions here.


