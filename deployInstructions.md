Currently served from D.O. account tmurv@shaw.ca 143.198.188.28
FE = /var/www/timesheets.ultrenos.ca/html
FE URL = timesheets.ultrenos.ca
BE = /app/ultrenos/ultrenostimesheets-api
BE URL = timesheets-api.ultrenos.ca (as of 2021, running on port 7050)

To Deploy FE:
- check .env for correct BackEnd
- check .env for BUILD_PATH=html
- npm run build 
Production BUILD:
- scp -r html/ root@143.198.188.28:/var/www/timesheets.ultrenos.ca/   // adds/replaces html subdir and all files except
Staging BUILD:
- scp -r html/ root@143.198.188.28:/var/www/timesheets-staging.ultrenos.ca/   // adds/replaces html subdir and all files