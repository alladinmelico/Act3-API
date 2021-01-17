const input = $('#comment')

$('form').on('submit', function (e) {
	e.preventDefault()
	if (input.val() !== '') {
		$('#submit')
			.prepend(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
		`)
		clear()
		language()
		sentiment()
		phrases()
		entity()
	}
})

const language = async () => {
	try {
		const response = await fetch(
			'https://svnhs-is.cognitiveservices.azure.com/text/analytics/v2.1/languages',
			{
				method: 'POST',
				body: JSON.stringify({
					documents: [{ text: input.val(), id: 1 }],
				}),
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
					'Ocp-Apim-Subscription-Key':
						'46a7958b0b424bc0aeeae8f9592d51ab',
				},
			}
		)
		const data = await response.json()
		await data.documents[0].detectedLanguages.forEach((element) => {
			$('#languageContainer').append(`
                <div
                    class="progress-bar"
                    role="progressbar"
                    style="width: ${element.score * 100}%"
                    aria-valuenow="${element.score * 100}"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    id="language"
                >
                ${element.name} ${element.score * 100}%
                </div>
        `)
		})

		await $('#loading span').remove()
	} catch (error) {
		console.log(error)
	}
}

const sentiment = async () => {
	try {
		const response = await fetch(
			'https://svnhs-is.cognitiveservices.azure.com/text/analytics/v2.1/sentiment',
			{
				method: 'POST',
				body: JSON.stringify({
					documents: [{ text: input.val(), id: 1 }],
				}),
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
					'Ocp-Apim-Subscription-Key':
						'46a7958b0b424bc0aeeae8f9592d51ab',
				},
			}
		)
		const data = await response.json()
		await fetchSentiment(data.documents[0])

		await $('#submit span').remove()
	} catch (error) {
		console.log(error)
	}
}

const phrases = async () => {
	try {
		const response = await fetch(
			'https://svnhs-is.cognitiveservices.azure.com/text/analytics/v2.1/keyPhrases',
			{
				method: 'POST',
				body: JSON.stringify({
					documents: [{ text: input.val(), id: 1 }],
				}),
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
					'Ocp-Apim-Subscription-Key':
						'46a7958b0b424bc0aeeae8f9592d51ab',
				},
			}
		)
		const data = await response.json()
		await fetchPhrases(data.documents[0].keyPhrases)

		await $('#submit span').remove()
	} catch (error) {
		console.log(error)
	}
}

const entity = async () => {
	try {
		const response = await fetch(
			'https://svnhs-is.cognitiveservices.azure.com/text/analytics/v2.1/entities',
			{
				method: 'POST',
				body: JSON.stringify({
					documents: [{ text: input.val(), id: 1 }],
				}),
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
					'Ocp-Apim-Subscription-Key':
						'46a7958b0b424bc0aeeae8f9592d51ab',
				},
			}
		)
		const data = await response.json()
		await console.log(data)
		await fetchEntities(data.documents[0].entities)

		await $('#submit span').remove()
	} catch (error) {
		console.log(error)
	}
}

function fetchSentiment(element) {
	let positive = Math.floor(element.score * 100)
	let negative = Math.floor(100 - element.score * 100)
	$('#sentimentContainer').append(`
        <div
            class="progress-bar bg-success"
            role="progressbar"
            style="width: ${positive}%"
            aria-valuenow="${positive}"
            aria-valuemin="0"
            aria-valuemax="100"
            id="language"
        >
        Positive 😊 ${positive}%
        </div>
    `)
	$('#sentimentContainer').append(`
        <div
            class="progress-bar bg-danger"
            role="progressbar"
            style="width: ${negative}%"
            aria-valuenow="${negative}"
            aria-valuemin="0"
            aria-valuemax="100"
            id="language"
        >
        Negative ☹ ${negative}%
        </div>
    `)
}

function fetchEntities(entities) {
	entities.forEach((element) => {
		element.matches.forEach((match) => {
			$('#entityContainer').append(
				`<a href="${element.wikipediaUrl}" class="m-2" target="_blank">${match.text}</a>`
			)
		})
	})
}

function fetchPhrases(items) {
	items.forEach((element) => {
		$('#phrasesContainer').append(
			`<span class="badge bg-primary m-2">${element}</span>`
		)
	})
}

function clear() {
	$('#sentimentContainer').html('')
	$('#languageContainer').html('')
	$('#phrasesContainer').html('')
	$('#entityContainer').html('')
}
