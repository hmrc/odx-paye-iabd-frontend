export default function isContainerInitialized(pConnect) {
  const context = pConnect.getContextName();
  const containerName = pConnect.getContainerName();
  return PCore.getContainerUtils().isContainerInitialized(context, containerName);
}
