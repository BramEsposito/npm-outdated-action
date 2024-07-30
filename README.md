# Check for outdated NPM packages in a Github Action 
Run this github action to check for outdated NPM packages in your repository. 

### Example

``` yml
name: Check for outdated packages

on: [push]

jobs:
  check_packages:
    runs-on: ubuntu-latest
    name: A job to test for outdated packages
    steps:
    - name: Test the released step
      id: check_packages
      uses: bramesposito/npm-outdated-action@v1
  
```
