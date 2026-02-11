provider "azurerm" {
  features {}
}

locals {
  aseName   = "core-compute-${var.env}"
  vaultName = "${var.product}-${var.env}"
}

data "azurerm_subnet" "core_infra_redis_subnet" {
  name                 = "core-infra-subnet-1-${var.env}"
  virtual_network_name = "core-infra-vnet-${var.env}"
  resource_group_name  = "core-infra-${var.env}"
}

module "pcq-frontend-redis-cache" {
  source                        = "git@github.com:hmcts/cnp-module-redis?ref=master"
  product                       = "${var.product}-${var.component}-redis-cache"
  location                      = var.location
  env                           = var.env
  private_endpoint_enabled      = true
  redis_version                 = "6"
  business_area                 = "cft"
  public_network_access_enabled = false
  common_tags                   = var.common_tags
  sku_name                      = var.sku_name
  family                        = var.family
  capacity                      = var.capacity
}

data "azurerm_key_vault" "key_vault" {
  name                = local.vaultName
  resource_group_name = local.vaultName
}

resource "azurerm_key_vault_secret" "redis_access_key" {
  name         = "${var.component}-redis-access-key"
  value        = module.pcq-frontend-redis-cache.access_key
  key_vault_id = data.azurerm_key_vault.key_vault.id
}

resource "azurerm_key_vault_secret" "frontend_redis_secret" {
  name         = "frontend-redis-secret"
  value        = random_password.frontend_redis_secret.result
  key_vault_id = data.azurerm_key_vault.key_vault.id
}

resource "random_password" "frontend_redis_secret" {
  length           = 32
  override_special = "()-_"

  keepers = {
    rotation = var.frontend_redis_secret_rotation
  }
}
