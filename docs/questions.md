# Steps Leaderboard Application Q&A

In this document, we discuss potential improvements and future steps for the Steps Leaderboard application, focusing on persistence, fault tolerance, scalability, and authentication.

---

### **Persistence**

**Q: How would you add a persistent storage layer such that the app could be restarted without losing counter states? What storage technology would you suggest?**

```answer
To add persistent storage, I would integrate a database that can keep the team and counter data even when the app is restarted. A relational database like **MySQL** or **PostgreSQL** would be a good choice for this because of their structured data handling, ACID properties (ensuring data integrity), and built-in scalability features. For a NoSQL option, **MongoDB** or **Redis** could be considered if the data model needs more flexibility or performance for specific scenarios.

Once persistent storage is set up, the team and counter data would be saved in the database, and we would load the state from the database when the app starts up again.

I added an abstraction for the data layer, making it easy to replace with any other storage technology (e.g., MySQL).
```

---

### **Fault Tolerance**

**Q: How would you design the app in order to make the functionality available even if some parts of the underlying hardware systems were to fail?**

```answer
To make the app fault-tolerant, I would introduce redundancy and replication for both the application and the database. For example, using **Docker** to containerize the app and deploy it across multiple servers (load-balanced) would ensure that if one instance goes down, another one can pick up the load.

For the database, using **replication** (e.g., MySQL master-slave or Redis replication for queue) ensures that if the primary database fails, a replica can take over. Additionally, we could use **circuit breakers** and **retry logic** in the code to gracefully handle temporary issues like network failures.
```

---

### **Scalability**

**Q: How would you design the app in order to ensure that it wouldn’t slow down or fail if usage increased by many orders of magnitude? What if this turned into a global contest with 10x, 100x, 1000x the number of teams and traffic? Does your choice of persistence layer change in this scenario?**

```answer
To scale the app, I'd start by ensuring **horizontal scalability**—this means we can add more servers (or containers) to handle increased traffic. We'd use **load balancers** to distribute the traffic across these instances. 

For database scalability, I'd recommend using **sharding** or **partitioning** in case the traffic grows dramatically. This way, the database load is spread across multiple machines. I'd also consider switching to or combining a **NoSQL database** like **MongoDB** or **Redis** for faster reads and writes when handling large amounts of data. Additionally, implementing **caching** (e.g., using Redis) would reduce load on the database by storing frequently accessed data in memory.

With 1000x growth, we could use **cloud solutions** like **AWS** or **GCP**, which provide managed database services and autoscaling to handle such spikes efficiently.
```

---

### **Authentication**

**Q: How would you ensure that only authorized users can submit and/or retrieve data? How would you then add support to allow different users to only update specific counters? Or perform only specific operations?**

```answer
To ensure only authorized users can access the system, I would implement **JWT (JSON Web Tokens)** for authentication. Each user would log in and receive a token that they must include with every request. The server would then verify the token before allowing access to any resources.

To restrict access further, we could add **role-based access control (RBAC)**. For example, only team members can update their specific counters, and certain operations (like deleting a team) would be restricted to admin users. Each JWT would include the user's role and allowed operations, and the backend would check these permissions before performing any action.
```

---

This concludes the Q&A. These are the suggested improvements to the Steps Leaderboard application for future versions.