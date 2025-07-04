import { useState } from 'react';
import { Button, VStack, Text, Code, Box, useToast, Spinner } from '@chakra-ui/react';
import { testSupabaseConnection } from '@/utils/testSupabaseConnection';

const SupabaseTest = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const toast = useToast();

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const result = await testSupabaseConnection();
      setTestResult(result);
      
      toast({
        title: result.success ? '✅ Conexión exitosa' : '❌ Error de conexión',
        description: result.message,
        status: result.success ? 'success' : 'error',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setTestResult({
        success: false,
        error: errorMessage,
        message: 'Error al ejecutar la prueba'
      });
      
      toast({
        title: '❌ Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="md" bg="white">
      <VStack spacing={4} align="stretch">
        <Text fontSize="xl" fontWeight="bold">🔌 Prueba de Conexión a Supabase</Text>
        
        <Button 
          colorScheme="blue" 
          onClick={handleTestConnection}
          isLoading={isTesting}
          loadingText="Probando..."
          leftIcon={isTesting ? <Spinner size="sm" /> : undefined}
        >
          Probar Conexión
        </Button>
        
        {testResult && (
          <Box mt={4} p={4} bg={testResult.success ? "green.50" : "red.50"} borderRadius="md">
            <Text fontWeight="bold" color={testResult.success ? "green.600" : "red.600"}>
              {testResult.success ? '✅ Prueba Exitosa' : '❌ Error en la Prueba'}
            </Text>
            <Text mt={2}>{testResult.message}</Text>
            
            {testResult.error && (
              <Box mt={2} p={2} bg="red.100" borderRadius="md">
                <Text fontWeight="bold">Error:</Text>
                <Code colorScheme="red" p={2} display="block" whiteSpace="pre-wrap">
                  {typeof testResult.error === 'string' 
                    ? testResult.error 
                    : JSON.stringify(testResult.error, null, 2)}
                </Code>
              </Box>
            )}
            
            {testResult.session && (
              <Box mt={4} p={2} bg="blue.50" borderRadius="md">
                <Text fontWeight="bold">Información de Sesión:</Text>
                <Code p={2} display="block" whiteSpace="pre-wrap" overflowX="auto">
                  {JSON.stringify(testResult.session, null, 2)}
                </Code>
              </Box>
            )}
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default SupabaseTest;
