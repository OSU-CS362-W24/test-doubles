/**
 * @jest-environment jsdom
 */

import fs from "fs"
import { jest } from '@jest/globals';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

import "@testing-library/jest-dom"
import domTesting from "@testing-library/dom"
import userEvent from"@testing-library/user-event"

import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"

import { createRequire } from "module"
const require = createRequire(import.meta.url)

const searchRepositoriesResult = require("./searchRepositoriesResult.json")

const server = setupServer(
	http.get("https://api.github.com/search/repositories", function({params}) {
		console.log("Fake API / intercept is called")
		return HttpResponse.json(searchRepositoriesResult)
	})
)


beforeAll(function() {
	server.listen()
})

beforeEach(function() {
	jest.resetModules()
})

afterEach(function() {
	server.resetHandlers()
})

afterAll(function() {
	server.close()
})

function initDomFromFiles(htmlPath, jsPath) {
    const html = fs.readFileSync(htmlPath, 'utf8')
    document.open()
    document.write(html)
    document.close()
	console.log(jsPath)
    import(jsPath)
}

test("correctly renders GitHub search results", async function () {
    initDomFromFiles(
        __dirname + "/githubSearch.html",
        __dirname + "/githubSearch.js"
    )

    const queryInput = domTesting.getByPlaceholderText(
        document,
        "Search GitHub"
    )
    const searchButton = domTesting.getByRole(document, "button")

    const user = userEvent.setup()
    await user.type(queryInput, "jest")
    await user.click(searchButton)

    const results = await domTesting.findAllByRole(document, "listitem")
	expect(results).toHaveLength(searchRepositoriesResult.items.length)
	expect(results[0]).toHaveTextContent(searchRepositoriesResult.items[0].full_name)
})

test("correctly 2 renders GitHub search results", async function () {
    initDomFromFiles(
        __dirname + "/githubSearch.html",
        __dirname + "/githubSearch.js"
    )

    const queryInput = domTesting.getByPlaceholderText(
        document,
        "Search GitHub"
    )
    const searchButton = domTesting.getByRole(document, "button")

    const user = userEvent.setup()
    await user.type(queryInput, "jest")
    await user.click(searchButton)

    const results = await domTesting.findAllByRole(document, "listitem")
	expect(results).toHaveLength(searchRepositoriesResult.items.length)
	expect(results[0]).toHaveTextContent(searchRepositoriesResult.items[0].full_name)
})
