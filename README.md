# LinkedIn Connection Automation Script

A JavaScript-based automation script for sending LinkedIn connection requests. This script helps automate the process of sending connection requests to LinkedIn users from search results pages.

## Features

- Automatically scrolls through search results

- Sends connection requests with or without custom notes

- Supports pagination through search results

- Configurable delays between actions

- Custom note templates with name personalization

- Detailed console logging for monitoring progress

- Configurable maximum request limit

## Installation

1\. Navigate to your LinkedIn search results page with potential connections

2\. Open your browser's Developer Tools (F12 or Right Click -> Inspect)

3\. Go to the Console tab

4\. Copy and paste the entire script into the console

5\. Press Enter to start the automation

## Configuration

The script can be configured by modifying the `config` object:

```javascript

config: {

    scrollDelay: 3000,      // Delay for scrolling actions (milliseconds)

    actionDelay: 5000,      // Delay between actions (milliseconds)

    nextPageDelay: 5000,    // Delay before moving to next page (milliseconds)

    maxRequests: -1,        // Maximum number of requests (-1 for unlimited)

    totalRequestsSent: 0,   // Counter for sent requests (do not modify)

    addNote: false,         // Whether to add a note to connections

    note: "Hey {{name}}, I'm eager to contribute my skills in the team. I'd love the opportunity to connect and learn more about potential openings.",  // Note template

}

```

### Configuration Options

- `scrollDelay`: Time to wait between scroll actions

- `actionDelay`: Time to wait between clicking buttons/actions

- `nextPageDelay`: Time to wait before moving to the next page

- `maxRequests`: Maximum number of requests to send (-1 for unlimited)

- `addNote`: Set to `true` to include a note with connection requests

- `note`: Template for connection notes. Use `{{name}}` to insert the person's first name

## Usage

1\. Set your desired configuration options

2\. Run the script in the console

3\. The script will automatically:

   - Scroll through the page to load all results

   - Find "Connect" buttons

   - Send connection requests

   - Move to the next page when finished

   - Continue until maximum requests are sent or no more results

## Console Output

The script provides detailed console logging:

- INFO: General progress information

- DEBUG: Detailed step-by-step actions

- WARN: Warnings and non-critical errors

- ERROR: Critical errors that stop the script

Example output:

```

INFO: script initialized on the page...

DEBUG: scrolling to bottom in 3000 ms

INFO: 10 connect buttons found

DEBUG: sending invite to 1 out of 10

```

## Safety Features

- Configurable delays to prevent rate limiting

- Maximum request limit option

- Automatic stopping when no more results are found

- Error handling for missing elements

## Troubleshooting

If the script isn't working:

1\. Check the console for error messages

2\. Ensure you're on a LinkedIn search results page

3\. Verify that there are "Connect" buttons visible

4\. Try increasing the delay values if actions are failing

5\. Refresh the page and try again

6\. Ensure you're logged into LinkedIn

## Limitations

- Works only on LinkedIn search results pages

- Requires manual reload if LinkedIn updates the page layout

- May be affected by LinkedIn UI changes

- Network speed may affect timing

## Disclaimer

This script is for educational purposes only. Using automation scripts may violate LinkedIn's terms of service. Use at your own risk and be mindful of LinkedIn's daily connection request limits.

## Support

For issues and feature requests, please check the console output for errors and adjust the configuration as needed.
