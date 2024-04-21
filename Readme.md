# Low memory file sorter

This NodeJS script sorts a file that is too big to fit in memory.

**Caution**: This script is quick, dirty, and slow, only done as a proof of concept.

## Usage

### Step 1 - Generate mock logs file

- Command: `npm generate-logs`
- This command generates a logs file that, by default, should be about 6MB in size.

### Step 2 - Sort the generated logs

- Command: `npm run start`
- By default, this command runs the script and only allows node to allocate 5MB of memory for the V8's engine heap.
- The generated logs will be split up into sorted batches.
- The sorted batches will then be merged into a `result.txt` file.
