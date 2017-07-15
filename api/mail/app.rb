require 'json';

class App < Sinatra::Base
    set :root, File.json(File.dirname(__FILE__), "..")
    set :public_dir, settings.root

    post 'api/send' do
        sleep 3
        {result: 'true'}.to_json
    end
end