# Blue-Green Deployment in Kubernetes
> Blue-Green deployment is a strategy that allows you to release new versions of your application with zero downtime and quick rollback capability. Here's a step-by-step guide to implement it using Kubernetes.


## 1. Deploy the Blue Environment (Current Live Version)
> First, apply the blue deployment and the service. This makes your current application live.
> This creates:
> - A deployment named nodejs-app-deployment-blue
> - A service named nodejs-service that routes traffic to pods labeled version=blue
```
kubectl apply -f blue-deployment-nodejs.yaml
kubectl apply -f service.yaml
```
---
## 2. Deploy the Green Environment (New Version with new dockerimage)
> Next, deploy the new version. It will start up, but the service isn't sending any traffic to it yet, so it's not live to users.
> This creates:
> - A deployment named nodejs-app-deployment-green
> - Pods labeled version=green that are isolated from live traffic
```
kubectl apply -f green-deployment-nodejs.yaml
```

## 3. Test the Green Environment Internally
> Before switching traffic, test the green version locally using port-forwarding.
```
# Get the name of a running green pod
GREEN_POD_NAME=$(kubectl get pods -l app=nodejs,version=green -o jsonpath='{.items[0].metadata.name}')

# Forward a local port (e.g., 8080) to the pod's port (3000)
kubectl port-forward $GREEN_POD_NAME 8080:3000
```
---

## 4. Switch Live Traffic to Green 🚀
> Once you're confident the green deployment is stable, patch the service to change its selector. This is the "switch" and it's instantaneous for users.
> - All live traffic is now being sent to your new version.

```
kubectl patch service nodejs-service -p '{"spec":{"selector":{"version":"green"}}}'
```

---
## 5. Monitor and Rollback if Needed
> Monitor the new version for any issues. If a problem arises, you can instantly roll back to the blue deployment with a similar patch command:

```
kubectl patch service nodejs-service -p '{"spec":{"selector":{"version":"blue"}}}'
```

---
## 6. Decommission the Blue Environment
> After confirming that the green deployment is stable over a period of time, you can safely delete the old blue deployment to free up resources.
```
kubectl delete deployment nodejs-app-deployment-blue
```