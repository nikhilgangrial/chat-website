import pymongo


link = "mongodb://admin:4gWGjt4TLkdlZg1B@cluster0-shard-00-00.xrq2g.mongodb.net:27017,cluster0-shard-00-01.xrq2g.\
mongodb.net:27017,cluster0-shard-00-02.xrq2g.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-1fpp0j-shard\
-0&authSource=admin&retryWrites=true&w=majority"

client = pymongo.MongoClient(link)
db = client['thewebsite']
col = db['users']

x = col.find()
for i in x:
    print(i)
print("sucess")
