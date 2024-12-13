## HLB API Client

Remember, before using any of the functions, you must import the module, and also call the `configSettings` function to set the configuration settings.

Example to test with local server:

```typescript
configSettings(
    {
        IsDebug: true, 
        config: 
            {
                API_URL: "http://localhost:3000/api"
            }
    }
);
```

