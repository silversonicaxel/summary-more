#!/usr/bin/env node

import { Configurer } from './class/configurer.js'
import { Maker } from './class/maker.js'

const configurer = new Configurer()
const userConfiguration = configurer.fetchData()

const maker = new Maker()
maker.applySummaryMore(
  userConfiguration.baseFolder,
  userConfiguration.docsFolder,
  userConfiguration.docsSection,
  Number(userConfiguration.headingLevel)
)
