module RequestHelpers
  def json_response
    JSON.parse(response.body)
  end

  def json_headers
    {
      'Accept' => 'application/json',
      'Content-Type' => 'application/json',
      'Host' => 'localhost'
    }
  end
end 