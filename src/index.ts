#!/usr/bin/env node

import { Configurer } from './class/configurer';
import { Maker } from './class/maker'

const configurer = new Configurer();
const userConfiguration = configurer.fetchData();

const maker = new Maker()
maker.createReadmeMore(
  userConfiguration.baseFolder,
  userConfiguration.docsFolder,
  userConfiguration.docsSection
)
