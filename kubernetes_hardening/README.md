
#  Kubernetes Deployment: nodejs + + MongoDB with Gatekeeper, NetworkPolicy, and Security Controls

### 1. Install Gatekeeper - This Gatekeeper policy enforces essential security and resource management settings for all Pods and Deployments in our Kubernetes cluster—except those in excluded namespaces like kube-system, local-path-storage, and gatekeeper-system. It uses a custom ConstraintTemplate called K8sRequiredSettings to define rules in Rego, the policy language used by Open Policy Agent (OPA). 

#### The policy checks each container in a Pod or Deployment to ensure three critical requirements are met:
- Non-root enforcement: Every container must explicitly set runAsNonRoot: true in its securityContext, helping prevent privilege escalation.
- Resource limits: Each container must define resources.limits to cap its maximum CPU and memory usage.
- Resource requests: Each container must also define resources.requests to guarantee a minimum amount of CPU and memory for scheduling.

```
kubectl apply -f https://raw.githubusercontent.com/open-policy-agent/gatekeeper/master/deploy/gatekeeper.yaml
kubectl get pods -n gatekeeper-system
```
#### Apply Gatekeeper 
```
kubectl apply -f ConstraintTemplate.yaml
kubectl apply -f Constraint.yml
```
---

### 2. MongoDB StatefulSet - This manifest sets up a secure and resource-managed MongoDB instance using a StatefulSet. It defines a Secret to store MongoDB credentials and database name in base64 format, which are injected into the container as environment variables. The MongoDB pod runs as a non-root user with restricted system calls via Seccomp, and has defined CPU and memory limits for stability. A ClusterIP service exposes MongoDB internally, while persistent storage is provisioned using a VolumeClaimTemplate to ensure data durability across pod restarts.

```
kubectl apply -f mongo-secrets.yaml
kubectl apply -f mongodb-deployment.yaml
kubectl get pvc -l app=mongodb
kubectl get storageclass
kubectl get statefulsets
```
--- You should see:

- Bound under the `STATUS` column of the PersistentVolumeClaim (PVC) output, indicating that the requested storage has been successfully provisioned and linked to a PersistentVolume.
- Ready or 1/1 under the READY column of the StatefulSet output, confirming that the MongoDB pod is up and running.

---

### 3. Nodejs deployment - This configuration deploys a nodejs frontend application using a Deployment and exposes it externally via a LoadBalancer service. The container runs securely as a non-root user with restricted system calls (Seccomp), and connects to a MongoDB backend using credentials stored in Kubernetes Secrets. It includes resource requests and limits for CPU and memory to ensure efficient scheduling and stability, along with a liveness probe to monitor application health. The pod is labeled for use with NetworkPolicies, enabling fine-grained traffic control.


```
kubectl apply -f nodejs-deployment.yaml,network-policy.yaml
kubectl get pods
kubectl get deployment
kubectl get networkpolicy -A
```

>If the manifest violates the policies defined in Gatekeeper, you will see an error like the one below:
```python
Error from server (Forbidden): error when creating "nodejs-deployment.yaml": admission webhook "validation.gatekeeper.sh" denied the request: [enforce-nonroot-and-resources] Container nodejs-app must set runAsNonRoot to true
```

### Access - Once the Node.js service is deployed, you can retrieve the external IP and port to access the ToDo GUI application using the following command:

```
kubectl describe svc nodejs-service
```

### Cleaning up - 
```
kubectl delete -f mongo-secrets.yaml,mongodb-deployment.yaml,nodejs-deployment.yaml,network-policy.yaml,ConstraintTemplate.yaml,Constraint.yml
kubectl delete -f https://raw.githubusercontent.com/open-policy-agent/gatekeeper/master/deploy/gatekeeper.yaml
```

### References

- [gatekeeper](https://open-policy-agent.github.io/gatekeeper/website/docs/constrainttemplates/)
