
# Kubernetes Audit Logging with K3s

Kubernetes does not store audit logs by default. Audit logging is an opt-in feature that must be explicitly configured in the `kube-apiserver`.

## What Is an Audit Log?

Each audit log entry is a JSON object that captures details about a request, including:

- **What** action was performed (e.g., create, delete, patch)
- **Who** performed the action (user or service account)
- **What** resource was affected (e.g., Pod, Secret, ConfigMap)
- **Where** the request came from (source IP address)
- **When** the action occurred

## Enabling Audit Logging

To enable it in K3s, you need to add the `audit-policy-file`  argument to the kube-apiserver.  If you're running Kubernetes via **kubeadm**, add it to the `/etc/kubernetes/manifests/kube-apiserver.yaml`  file.  But if you've installed Kubernetes using **K3s**, follow the steps below:


### 1. Create the audit policy file. The `audit-policy.yaml`  file should be placed in this folder.
```
mkdir -p /etc/k3s
nano /etc/k3s/audit-policy.yaml
```
### 2.  Edit /etc/rancher/k3s/config.yaml

```
kube-apiserver-arg:
- "audit-policy-file=/etc/k3s/audit-policy.yaml"
- "audit-log-path=/var/lib/rancher/k3s/audit.log"
```

### 3. Reload and restart K3s
```
sudo systemctl daemon-reexec
sudo systemctl restart k3s
```
Once you deploy any pod or access secrets, the information will be stored in the `/var/lib/rancher/k3s/audit.log`  file.

```
{"kind":"Event","apiVersion":"audit.k8s.io/v1","level":"Metadata","auditID":"866b752b-8926-4ddb-86a5-44ccf33cead8","stage":"RequestReceived","requestURI":"/api/v1/namespaces/default/secrets/mongodb-secret","verb":"get","user":{"username":"system:admin","groups":["system:masters","system:authenticated"],"extra":{"authentication.kubernetes.io/credential-id":["X509SHA256=803c0e8f9b1036baf1dd4bdceb1c6525c1e71efc18e76032a886957a893ada1b"]}},"sourceIPs":["127.0.0.1"],"userAgent":"kubectl/v1.34.1 (linux/amd64) kubernetes/93248f9","objectRef":{"resource":"secrets","namespace":"default","name":"mongodb-secret","apiVersion":"v1"},"requestReceivedTimestamp":"2025-10-16T17:25:24.473686Z","stageTimestamp":"2025-10-16T17:25:24.473686Z"}
```
  

## The security controls implemented in this project help meet the requirements of several major compliance standards:

- SOC2: The combination of Gatekeeper policies, access controls, and audit logs provides the necessary audit trail and monitoring to demonstrate that security controls are in place and effective.

- GDPR: NetworkPolicies and audit logs help enforce and prove that access to personal data is restricted and tracked, supporting GDPR's principles of accountability and data protection.

- HIPAA: The technical safeguards for protecting electronic Protected Health Information (ePHI) are addressed through strict network segmentation, access logging, and enforced security configurations via Gatekeeper.

*Reference -*

*https://kubernetes.io/docs/tasks/debug/debug-cluster/audit/*
*https://secureframe.com/hub/soc-2/what-is-soc-2*
*https://gdpr-info.eu/*
