# Henry Daily

- Simple Node API server for sharing news and comments with my loved one, ***Mia***.
- ***Also serves as a self-learning/practice project in Node.js***, therefore amateur.

---

## examples

```bash
# Get all articles
curl -X GET -H "Content-Type: application/json" -d '{"apikey":"apikey"}' http://localhost:3000/api/v1/article/
# Get a single article
curl -X GET -H "Content-Type: application/json" -d '{"apikey":"apikey"}' http://localhost:3000/api/v1/article/7
# Create a new article
curl -X POST -H "Content-Type: application/json" -d '{"apikey":"apikey","url":"url","comment":"comment"}' http://localhost:3000/api/v1/article 
# Delete a single article
curl -X DELETE -H "Content-Type: application/json" -d '{"apikey":"apikey"}' http://localhost:3000/api/v1/article/7
```

Update should not be user-handled.

---

**Heavily inspired by [湾区日报](https://wanqu.co/b/7/2015-05-24-behind-the-scenes.html)**

11th March 2018
