# business_card
A business card application that reads OCR business contacts and outputs the desired extracted fields

# To Run Application
Node 10 LTS or later is required!
```
cd business_card
npm i
npm start
```

At this point, the dev server is running and the web page can be visited at localhost:8000

Each business card OCR text can be pasted into the input field and outputs will be observed below

Another way to use this application as a service would be to use the following command replacing your data with the demo data

```
curl -XPOST http://localhost:8008/parseOcrText -i -H "Content-Type: application/json" -d '{"inputText": "ASYMMETRIK LTD\nMike Smith\nSenior Software Engineer\n(410)555-1234\nmsmith@asymmetrik.com\n"}'
```
