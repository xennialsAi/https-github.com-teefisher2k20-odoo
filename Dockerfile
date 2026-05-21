# Use the official Odoo base image
FROM odoo:17.0

# Switch to root user to install extra dependencies if needed
USER root

# Install system dependencies (e.g., git, python3-pip, compilers if needed for native modules)
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# (Optional) Install any extra Python packages required by custom modules
# COPY requirements.txt /etc/odoo/requirements.txt
# RUN pip3 install -r /etc/odoo/requirements.txt

# Create a directory for custom developer modules / addons
RUN mkdir -p /mnt/custom-addons \
    && chown -R odoo:odoo /mnt/custom-addons

# Copy default configuration file (optional; otherwise Odoo uses default port/db configurations)
# COPY ./odoo.conf /etc/odoo/

# Switch back to the non-root odoo user for security
USER odoo

# Expose the standard Odoo service port (8069) and the longpolling port (8072)
EXPOSE 8069 8072

# Run the default Odoo server configuration
ENTRYPOINT ["/entrypoint.sh"]
CMD ["odoo"]
