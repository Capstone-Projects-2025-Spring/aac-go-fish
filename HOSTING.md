# HOSTING.md

## Overview
This document describes how to host the AAC project using AWS EC2, Route 53, Nginx, SSL/Let's Encrypt, Docker, and Watchtower for automatic container updates.

---

## Prerequisites
- An AWS account
- A domain name


---

## 1. Provision EC2 Instance
1. Log in to the AWS Management Console.
2. Navigate to EC2 and launch a new instance:
   - **AMI**: Ubuntu 22.04 LTS
   - **Instance type**: t1.xlarge
   - **Key pair**: select or create your SSH key
   - **Network & security**: create a Security Group allowing inbound:
     - SSH (port 22)
     - HTTP (port 80)
     - HTTPS (port 443)
3. Launch the instance.

---

## 2. Allocate & Associate Elastic IP
1. In the EC2 console, go to **Elastic IPs** and allocate a new address.
2. Associate it with your EC2 instance.

---

## 3. DNS Configuration (Route 53)
1. In Route 53, create or select the Hosted Zone for your domain.
2. Add an **A** record for `@` pointing to your Elastic IP, TTL 300.
3. (Optional) Add a **CNAME** for `www` pointing to your root domain.
4. Point your domain name to the Elastic IP.

---

## 4. SSH into Your Instance or use EC2 Instance Connect
```bash
ssh -i ~/.ssh/your_key.pem ec2-user@YOUR_ELASTIC_IP  # Amazon Linux
# or
ssh -i ~/.ssh/your_key.pem ubuntu@YOUR_ELASTIC_IP    # Ubuntu
```

---

## 5. Install Docker & Docker Compose
```bash
# Update OS
sudo apt update -y && sudo apt upgrade -y

# Install Docker
sudo apt install docker.io -y
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
```
---

## 6. Clone the Repository
```bash
git clone https://github.com/Capstone-Projects-2025-Spring/aac-go-fish.git
```

---

## 7. Configure Environment Variables
1. Change backend FRONTEND_URL field in `compose.yaml` to your domain name
```
FRONTEND_URL: "https://bankruptcyassociation.com"
```
2. _(optional)_ Select backend MODE field in `compose.yaml` to set game mode

   Options:
   - **cycle**: randomizes user roles and shuffles after each day **(default if left blank)**
   - **fixed**: each user stays on same role for every day, assigned by join order (Manager -> Burger -> Drink -> Side)
```
MODE: "cycle"
```
3. Change `nginx.conf` to use your Elastic IP and domain name
```
    server_name bankruptcyassociation.com www.bankruptcyassociation.com 54.159.150.176;
```
---

## 8. Obtain SSL Certificates
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx
```

---

## 9. Launch All Services (Add -d to run detached)
```bash
docker compose --profile prod up
```

---
