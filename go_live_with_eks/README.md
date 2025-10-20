# EKS Deployment

### Step 1: Configure AWS CLI and Verify
```
aws configure
aws sts get-caller-identity
```
---
### Step 2: Initialize and Apply Terraform
> This step initializes your Terraform configuration and provisions the infrastructure. You can customize the deployment by modifying values in the [variables.tf](https://github.com/rgonlinux/realworld-scenario-with-kubernetes/tree/main/go_live_with_eks/terraform/variables.tf) file.
```
cd terraform
terraform init
terraform apply
```
#### Verify Kubernetes Access -
> You're successfully authenticated and ready to manage your cluster.
```
kubectl auth can-i list nodes
```
---
### Step 3: Now it's time to deploy our app

#### -> Add the Gatekeeper Helm repository and apply manifest

```
helm repo add gatekeeper https://open-policy-agent.github.io/gatekeeper/charts
helm install gatekeeper/gatekeeper --name-template=gatekeeper --namespace gatekeeper-system --create-namespace
kubectl apply -f ConstraintTemplate.yaml
kubectl apply -f Constraint.yaml
```
---
#### -> Deploy mongodb with KMS

```
aws kms create-key --description "EKS secrets encryption key"
```
```
aws eks associate-encryption-config \
  --cluster-name <my-cluster> \
  --encryption-config '[{"resources":["secrets"],"provider":{"keyArn":"arn:aws:kms:<region>:<account-id>:key/<kms-key-id>"}}]'
```
> You can monitor the status of your encryption update with the following command. Use the specific cluster name and update ID that was returned in the previous output. When a Successful status is displayed, the update is complete
```
aws eks describe-update \
    --region region-code \
    --name my-cluster \
    --update-id 3141b835-8103-423a-8e68-12c2521ffa4d
```
> To verify that encryption is enabled in your cluster, run the describe-cluster command. The response contains an EncryptionConfig string.
```
aws eks describe-cluster --region region-code --name my-cluster
```
> Once KMS is enabled deploy your manifest file - 
```
kubectl apply -f mongo-secrets.yaml,mongodb-deployment.yaml
kubectl get pvc -l app=mongodb
kubectl get storageclass
kubectl get statefulsets
```

> You should see:
>  - Bound under the `STATUS` column of the PersistentVolumeClaim (PVC) output, indicating that the requested storage has been successfully provisioned and linked to a PersistentVolume.
>  - Ready or 1/1 under the READY column of the StatefulSet output, confirming that the MongoDB pod is up and running.

---

#### -> Deploy nodejs
> We will use ClusterIP to ensure it is accessible only within the internal network, and NetworkPolicies, enabling fine-grained traffic control.
```
kubectl apply -f nodejs-deployment.yaml,network-policy.yaml
kubectl get pods
kubectl get deployment
kubectl get networkpolicy -A
```

#### -> Add Ingress
> expose your nodejs-service to the internet
```
kubectl apply -f ingress.yaml
```

#### Get ALB DNS name

```
kubectl get ingress nodejs-ingress
```
---
### Cleaning up -

```
kubectl delete -f mongo-secrets.yaml,mongodb-deployment.yaml,nodejs-deployment.yaml,network-policy.yaml,ConstraintTemplate.yaml,Constraint.yaml
terraform destroy
```
---

### References

- [gatekeeper](https://open-policy-agent.github.io/gatekeeper/website/docs/constrainttemplates/)
- [KMS](https://docs.aws.amazon.com/eks/latest/userguide/enable-kms.html)