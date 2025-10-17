import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {StreamableHTTPServerTransport} from '@modelcontextprotocol/sdk/server/streamableHttp.js';

const exp = require('express');
const z   = require('zod');

//creating a mcp server:
const server = new McpServer({
    name:"test",
    version:"1.0.0"
});


server.registerTool(
    'add',
    {
        title        :"Addition Tool",
        description  : "Add two numbers",
        inputSchema  : {a:z.number(),b:z.number()},
        outputSchema : {result: z.number()},
    },
    async ({a,b}) => {
        const output = {result: a+b};
        return {
            content : [{type:'text',text:JSON.stringify(output)}],
            structuredContent: output
        }
    }
);

const app = exp();
app.use(exp.json());

app.post('/mcp',async(req,res)=>{
    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator:undefined,
        enableJsonResponse:true
    });
    res.on('close',()=>{
        transport.close();
    });
    await server.connect(transport);
    await transport.handleRequest(req,res,req.body);
});

const port = parseInt(process.env.PORT || '3000');

app.listen(port,()=>{
    console.log(`Demo MCP server running on http://localhost:${port}/mcp`);
})