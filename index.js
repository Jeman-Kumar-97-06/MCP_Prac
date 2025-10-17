import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import Cerebras from '@cerebras/cerebras_cloud_sdk';

const cclient = new Cerebras({
    apiKey:"csk-486fnf2r8tj5dhy3ryw29h4xhpc84rp6jx5f3mj5f3y8vwnc"
})

async function main() {
    const transport = new StreamableHTTPClientTransport({url:"http://localhost:3000/mcp"});
    const client    = new Client(transport);
    // await client.connect();
    const userPrompt= "Use your add tool to add 5 and 9";
    const completion= await cclient.chat.completions.create({
        messages :[
            {role:'system',content:'You are connected to an MCP Server with a tool called "add".'},
            {role:'user',content:userPrompt}
        ],
        model: "llama-4-scout-17b-16e-instruct",
    });
    console.log(completion?.choices[0]?.message);
};

main()

