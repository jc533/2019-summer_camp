#!/bin/sh
mongoexport -d 2019-cscamp -c register --type=csv -o register.csv -f fullname,gender,size,school,phone,parentName,transport,email,id,birthday,emergencyContact,parentalConsent,message,time
zip -r -0 2019_cscamp_registration.zip upload/ register.csv
