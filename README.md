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

Another way to use this application as an API service using cURL. Here is an example:

```
curl -XPOST http://localhost:8008/parseOcrText -i -H "Content-Type: application/json" -d '{"inputText": "TEST LTD\nJohn Doe\nSoftware Engineer\n(123)456-7890\jdoe@test.com\n"}'
```

# To Test Application
Node 10 LTS or later is required!
```
cd business_card
npm run test
```

Additional test cases can be added to the application by navigating to the app/controllers/testAssets/cases.js file and creating a new object for the case. The format should be:
```
{
  input: 'YOUR INPUT\nOCR TEXT HERE',
  output: {
    name: 'NAME THAT SHOULD BE FOUND',
    email: 'EMAIL THAT SHOULD BE FOUND',
    phone: 'PHONE THAT SHOULD BE FOUND',
  },
}
```
