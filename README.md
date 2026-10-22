# Everyday / On View

A Flask app that turns an ordinary object into a contemporary artwork. It
creates a museum tombstone, an extended interpretive label, and an exhibition
image with the OpenAI API.

## Run locally

1. Install the dependencies with `pip install -r requirements.txt`.
2. Set `OPENAI_API_KEY` in your environment or in a local `.env` file.
3. Start the app with `python app.py` and open `http://127.0.0.1:5000`.

Keep the API key on the server and out of source control. To deploy, configure
the same environment variable in your hosting provider and run the app with a
production WSGI server such as Gunicorn.
