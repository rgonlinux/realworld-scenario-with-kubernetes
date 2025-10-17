
## Monitoring & Logging with Datadog -

This guide walks you through installing the Datadog Agent in Kubernetes, configuring alerts for `ImagePullBackOff`, and testing the setup.

### 1. Log in to [Datadog](https://app.datadoghq.com/) and select your agent. The following command will be auto-populated with your credentials if you chose linux:

```
DD_API_KEY=<DD_KEY> \
DD_SITE="<DD_SITE>" \
DD_REMOTE_UPDATES=true \
DD_ENV=<DD_ENV> \
bash -c "$(curl -L https://install.datadoghq.com/scripts/install_script_agent7.sh)"
```

### 2. Install Datadog Agent in Kubernetes, and your DD_API_KEY in datadog-values.yaml file
```
sudo kubectl create namespace datadog
sudo helm install datadog-agent datadog/datadog -f datadog-values.yaml --namespace datadog
```

- or use helm to install datadog -
```
helm repo add datadog https://helm.datadoghq.com
helm install datadog-operator datadog/datadog-operator
kubectl create secret generic datadog-secret --from-literal api-key=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
kubectl apply -f datadog-agent.yaml
```

### 3. Create alert
- Navigate to **Monitors** → **New Monitor** → **Metric**
- Use the template for Kubernetes `ImagePullBackOff` state
- Under **Evaluation Details**:
--Set **Custom Rolling Window** to `1 minute`
--Set **Alert Threshold** to `0`
- Under **Notifications & Automations**, Add your email address or preferred notification channel
- create and publish

### 4. Test the Alert
- To test it, change the image name to a random value and deploy the pod. You should then see the alerts being triggered.

### Cleanup
```
helm uninstall datadog-agent
```

### References
- [Datadog](https://docs.datadoghq.com/containers/kubernetes/?tab=helm)
