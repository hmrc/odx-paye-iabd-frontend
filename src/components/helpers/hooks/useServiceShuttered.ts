import { useEffect, useState } from 'react';
import { getServiceShutteredStatus } from '../utils';

interface ServiceShutteredProps {
  serviceShuttered: boolean;
  isLoading: boolean;
}

export default function useServiceShuttered(): ServiceShutteredProps {
  const [serviceShuttered, setServiceShuttered] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const isServiceShuttered = async () => {
      try {
        setIsLoading(true);
        const status = await getServiceShutteredStatus();
        setServiceShuttered(status);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        setServiceShuttered(false);
      } finally {
        setIsLoading(false);
      }
    };

    isServiceShuttered();
  }, []);

  return {serviceShuttered, isLoading};
}
