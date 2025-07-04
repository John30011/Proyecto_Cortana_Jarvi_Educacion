import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Select, 
  VStack, 
  HStack, 
  Text, 
  Textarea, 
  useToast,
  Badge,
  Divider,
  IconButton,
  Tooltip,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Code,
  useColorModeValue,
} from '@chakra-ui/react';
import { DownloadIcon, DeleteIcon, WarningIcon, InfoIcon } from '@chakra-ui/icons';
import { logger, LogEntry, LogLevel } from '../../utils/logger';

type LogLevelFilter = 'all' | LogLevel;

const LogViewer: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<LogLevelFilter>('all');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  const loadLogs = () => {
    try {
      const allLogs = logger.getLogs();
      setLogs(allLogs);
    } catch (error) {
      console.error('Error loading logs:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los registros de error',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  useEffect(() => {
    loadLogs();
    
    // Recargar logs cada 5 segundos
    const interval = setInterval(loadLogs, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.level === filter);
    
  const handleClearLogs = () => {
    logger.clearLogs();
    setLogs([]);
    toast({
      title: 'Registros borrados',
      description: 'Todos los registros han sido eliminados',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };
  
  const handleDownloadLogs = () => {
    try {
      logger.downloadLogs();
    } catch (error) {
      console.error('Error downloading logs:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron descargar los registros',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  const getLogColor = (level: LogLevel) => {
    switch (level) {
      case 'error': return 'red';
      case 'warn': return 'orange';
      case 'info': return 'blue';
      case 'debug': return 'gray';
      default: return 'gray';
    }
  };
  
  const formatContext = (context?: Record<string, unknown>) => {
    if (!context) return null;
    return JSON.stringify(context, null, 2);
  };
  
  return (
    <Box p={4} bg={bgColor} borderRadius="md" boxShadow="md">
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between" mb={4}>
          <Heading size="md">Registros de la Aplicación</Heading>
          <HStack>
            <Select 
              value={filter}
              onChange={(e) => setFilter(e.target.value as LogLevelFilter)}
              width="200px"
              size="sm"
            >
              <option value="all">Todos los niveles</option>
              <option value="error">Errores</option>
              <option value="warn">Advertencias</option>
              <option value="info">Información</option>
              <option value="debug">Depuración</option>
            </Select>
            
            <Tooltip label="Descargar registros">
              <IconButton
                aria-label="Descargar registros"
                icon={<DownloadIcon />}
                onClick={handleDownloadLogs}
                colorScheme="blue"
                size="sm"
              />
            </Tooltip>
            
            <Tooltip label="Borrar todos los registros">
              <IconButton
                aria-label="Borrar registros"
                icon={<DeleteIcon />}
                onClick={handleClearLogs}
                colorScheme="red"
                size="sm"
              />
            </Tooltip>
          </HStack>
        </HStack>
        
        <Box 
          border="1px" 
          borderColor={borderColor} 
          borderRadius="md" 
          p={2} 
          maxHeight="500px" 
          overflowY="auto"
          bg={useColorModeValue('gray.50', 'gray.900')}
        >
          {filteredLogs.length === 0 ? (
            <Text textAlign="center" py={4} color="gray.500">
              No hay registros para mostrar
            </Text>
          ) : (
            <VStack align="stretch" spacing={2}>
              {filteredLogs.map((log, index) => (
                <Box 
                  key={`${log.timestamp}-${index}`}
                  p={2} 
                  borderRadius="md"
                  borderLeft="4px"
                  borderLeftColor={getLogColor(log.level)}
                  bg={bgColor}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                  cursor="pointer"
                  onClick={() => {
                    setSelectedLog(log);
                    onOpen();
                  }}
                >
                  <HStack spacing={2}>
                    <Badge colorScheme={getLogColor(log.level)}>
                      {log.level.toUpperCase()}
                    </Badge>
                    <Text fontSize="sm" color="gray.500" isTruncated>
                      {log.timestamp}
                    </Text>
                  </HStack>
                  <Text isTruncated mt={1}>
                    {log.message}
                  </Text>
                </Box>
              ))}
            </VStack>
          )}
        </Box>
      </VStack>
      
      {/* Modal para ver detalles del log */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              {selectedLog?.level === 'error' && <WarningIcon color="red.500" mr={2} />}
              {selectedLog?.level === 'warn' && <WarningIcon color="orange.500" mr={2} />}
              {selectedLog?.level === 'info' && <InfoIcon color="blue.500" mr={2} />}
              Detalles del registro
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="stretch" spacing={4}>
              <Box>
                <Text fontWeight="bold">Mensaje:</Text>
                <Text>{selectedLog?.message}</Text>
              </Box>
              
              <Box>
                <Text fontWeight="bold">Nivel:</Text>
                <Badge colorScheme={selectedLog ? getLogColor(selectedLog.level) : 'gray'}>
                  {selectedLog?.level.toUpperCase()}
                </Badge>
              </Box>
              
              <Box>
                <Text fontWeight="bold">Fecha y hora:</Text>
                <Text>{selectedLog?.timestamp}</Text>
              </Box>
              
              {selectedLog?.context && (
                <Box>
                  <Text fontWeight="bold">Contexto:</Text>
                  <Code 
                    p={2} 
                    borderRadius="md" 
                    width="100%" 
                    whiteSpace="pre-wrap" 
                    fontSize="xs"
                    overflowX="auto"
                  >
                    {formatContext(selectedLog.context)}
                  </Code>
                </Box>
              )}
              
              {selectedLog?.error && (
                <Box>
                  <Text fontWeight="bold">Error:</Text>
                  <VStack align="start" bg="red.50" p={3} borderRadius="md">
                    <Text><strong>Nombre:</strong> {selectedLog.error.name}</Text>
                    <Text><strong>Mensaje:</strong> {selectedLog.error.message}</Text>
                    {selectedLog.error.stack && (
                      <Box width="100%">
                        <Text fontWeight="bold" mb={1}>Stack trace:</Text>
                        <Code 
                          p={2} 
                          borderRadius="md" 
                          width="100%" 
                          whiteSpace="pre-wrap" 
                          fontSize="xs"
                          overflowX="auto"
                          display="block"
                        >
                          {selectedLog.error.stack}
                        </Code>
                      </Box>
                    )}
                  </VStack>
                </Box>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default LogViewer;
