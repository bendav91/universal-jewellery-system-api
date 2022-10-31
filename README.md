### Publish Docker Image
#### Digital Ocean
1. Run: `yarn docker build`
   1. If not logged in to Digital Ocean registry do the following:
   2. Run: `yarn docker:login`
   3. Enter `Username: <paste-api-token-from-do>`
   4. And`Password: <paste-api-token-from-do>`
2. Run: `yarn docker:push`

### K8S

***Prerequisite**: First, download the cluster configuration file from Digital Ocean and add to .kube folder (it should be git ignored and not commited)

#### Get Nodes

Run: `kubectl --kubeconfig=./universal-jewllery-api-k8s-kubeconfig.yaml get nodes`

#### Get Contexts

Run: `kubectl --kubeconfig=./universal-jewllery-api-k8s-kubeconfig.yaml config get-contexts`

#### Cluster Info

Run: `kubectl --kubeconfig=./universal-jewllery-api-k8s-kubeconfig.yaml cluster-info`

### Version

Run: `kubectl --kubeconfig=./universal-jewllery-api-k8s-kubeconfig.yaml version --output=json`
