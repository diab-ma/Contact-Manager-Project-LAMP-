This GitHub Actions CI/CD pipeline automates the process of building, testing, and deploying a PHP-based project whenever changes are pushed to the `main` branch.
The workflow is divided into two main jobs: `build-and-test` and `deploy`. The pipeline starts with the `build-and-test` job, which runs on an Ubuntu environment. 
It checks out the repository code, sets up PHP version 8.1 with specific extensions (`mbstring`, `mysqli`), and installs project dependencies using Composer.
If a `composer.json` file is not present, it creates a minimal one to ensure the installation can proceed. It then attempts to run tests using PHPUnit, if a configuration file (`phpunit.xml`) is found.

The second job, `deploy`, is triggered only if the `build-and-test` job completes successfully and the push is on the `main` branch. 
This job is responsible for deploying the code to a DigitalOcean Droplet. It starts by checking out the code again, then sets up the `doctl` CLI using a secret API token. 
It installs `sshpass` to facilitate non-interactive SSH logins and configures SSH to bypass host key checks. 
The pipeline verifies the SSH connection to the remote server, then uses `rsync` to transfer project files to the web server directory (`/var/www/html/`), excluding certain directories like `.git` and `.github`.

Once the files are synchronized, the workflow connects to the server via SSH to perform several deployment steps. 
These include installing Composer dependencies on the server (in production mode), running Laravel Artisan commands such as database migrations and cache clearing (if applicable), adjusting file ownership for web server 
compatibility, and restarting Apache to apply any changes. This pipeline ensures a smooth, automated deployment process from code commit to live server update.
