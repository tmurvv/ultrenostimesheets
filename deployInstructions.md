Currently served from D.O. account tmurv@shaw.ca 143.198.188.28
FE = /var/www/timesheets.ultrenos.ca/html
FE URL = timesheets.ultrenos.ca
BE = /app/ultrenos/ultrenostimesheets-api
BE URL = timesheets-api.ultrenos.ca (as of 2021, running on port 7050)
FE-staging = /var/www/timesheets-staging.ultrenos.ca/html
FE-staging URL = timesheets-staging.ultrenos.ca
BE-staging = /app/ultrenos/ultrenostimesheets-staging-api
BE-staging URL = timesheets-staging-api.ultrenos.ca (as of 2021, running on port 7051)

To Deploy FE:
- check .env for correct BackEnd
- check .env for BUILD_PATH=html
- npm run build 
Production BUILD:
- don't forget to run build
- scp -r html/ root@143.198.188.28:/var/www/timesheets.ultrenos.ca/   // adds/replaces html subdir and all files
Staging BUILD:
- don't forget to run build
- scp -r html/ root@143.198.188.28:/var/www/timesheets-staging.ultrenos.ca/   // adds/replaces html subdir and all files