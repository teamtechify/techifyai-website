# Voiceflow Transcript Saving

This feature allows the website to save conversation transcripts using Voiceflow's Transcript API.

## How It Works

After each interaction between the user and the Nova AI assistant, the system automatically saves the transcript to Voiceflow's platform. This allows administrators to review conversations later through the Voiceflow dashboard.

## Implementation Details

### API Endpoint

The system uses a custom API endpoint at `/api/transcripts` that issues a PUT request to Voiceflow's Transcript API:

```
PUT https://api.voiceflow.com/v2/transcripts
```

### Required Environment Variables

For this feature to work properly, you need to add the following environment variables to your `.env.local` file:

```
# Voiceflow API Configuration
VOICEFLOW_API_KEY=VF.DM.XXXXXXX.XXXXXX  # API key from Voiceflow dashboard
VOICEFLOW_PROJECT_ID=YOUR_PROJECT_ID_HERE  # Project ID for transcript saving
VOICEFLOW_VERSION_ID=production  # Version ID, usually 'production' (only change if using specific version)
```

To obtain these values:
1. **API Key**: Go to your Voiceflow agent dashboard > Integrations > API Keys
2. **Project ID**: This is your Voiceflow project/agent ID, found in the URL when editing your agent
3. **Version ID**: Usually 'production' unless you're targeting a specific version

### Code Flow

1. User interacts with Nova AI assistant in the chat interface
2. After each AI response, the system calls the transcript saving endpoint
3. The endpoint communicates with Voiceflow's API to save the transcript
4. The conversation history becomes available in Voiceflow's dashboard

## Viewing Saved Transcripts

Administrators can view all saved transcripts by:
1. Logging into Voiceflow
2. Opening the specific agent/project
3. Navigating to the "Transcripts" tab
4. Browsing or searching for specific conversations by session ID or content

## Troubleshooting

If transcript saving is not working:
1. Verify all environment variables are correctly set
2. Check server logs for specific error messages
3. Ensure your Voiceflow API key has sufficient permissions
4. Verify that the project ID and version ID are correct 